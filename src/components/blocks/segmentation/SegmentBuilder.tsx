import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios from "@/API/axios";
import { ArrowLeft, Code, EllipsisVertical } from "lucide-react";
import { SegmentBuilderProps } from "@/types/segmentTypes"
import { generateSQLPreview } from "./DefinitionTab/SQLState/SQLPreview";
import RenderDefinition from "./DefinitionTab/RenderDefinition";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { useSegmentData } from "@/context/SegmentDataContext";


export default function SegmentBuilder({ onBack, editSegment }: SegmentBuilderProps) {
    const {
        segmentName,
        setSegmentName,
        setSegmentId,
        selectedDataset,
        conditions,
        attributes,
        rootOperator,
        setPreviewData,
        segmentId,
        description,
        estimatedSize,
        conditionGroups,
        setEditableSql,
        setSqlError } = useSegmentData();

    const { 
        setSqlDialogOpen,
        setPreviewLoading,
        setPreviewOpen,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        previewLoading,
        previewOpen,
        sqlDialogOpen,
        discardConfirmOpen,
        setDiscardConfirmOpen } = useSegmentToggle();


    useEffect(() => {
        const slug = segmentName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
        setSegmentId(`segment:${slug}`);
    }, [segmentName]);

    //SQL Preview
    const generateSQL = () => {
        return generateSQLPreview(selectedDataset, conditions, attributes, rootOperator)
    }
    // Function to open SQL dialog
    const handleOpenSqlDialog = () => {
        setEditableSql(generateSQL);
        setSqlError(null);
        setSqlDialogOpen(true);
    };

    // Function to fetch preview data based on current conditions
    const fetchPreviewData = async () => {
        setPreviewLoading(true);
        setPreviewOpen(true); // Open dialog immediately to show loading state

        try {
            const sqlQuery = generateSQLPreview(selectedDataset, conditions, attributes, rootOperator);

            // Get connection URL from localStorage
            const connectionUrl = localStorage.getItem('postgres_connection');

            if (!connectionUrl) {
                toast.error("Connection URL not configured. Please set the connection URL first.");
                setPreviewLoading(false);
                return;
            }

            // Only log the query, not the connection details
            console.log("Executing SQL query for preview:", sqlQuery);

            try {
                const url = new URL(connectionUrl);
                const username = url.username;
                const password = url.password; // Will be sent securely but not logged
                const host = url.hostname;
                const port = url.port;
                const database = url.pathname.replace('/', '');

                // Format request data to match what the API expects
                const requestData = {
                    table: selectedDataset.name,
                    query: sqlQuery,
                    connection_details: {
                        host,
                        port,
                        database,
                        username,
                        password
                    }
                };

                // Log request WITHOUT showing password
                console.log("Sending request to API with connection details:", {
                    table: requestData.table,
                    query: requestData.query,
                    connection_details: {
                        host: requestData.connection_details.host,
                        port: requestData.connection_details.port,
                        database: requestData.connection_details.database,
                        username: requestData.connection_details.username,
                        password: "********" // Mask password in logs
                    }
                });

                // Call the API endpoint
                const response = await axios.post(`/query`, requestData);

                // Only log the success status, not the full response which might contain sensitive data
                console.log(`Query executed successfully. Status: ${response.status}, Records: ${response.data?.data?.length || 0}`);

                // Process the response as before
                if (response.data && response.data.success) {
                    setPreviewData(response.data.data || []);

                    if (response.data.data && response.data.data.length > 0) {
                        toast.success(`Retrieved ${response.data.data.length} records`);
                    } else {
                        toast.warning("Query executed successfully but returned no records");
                    }
                } else {
                    toast.warning("No results returned. Your query may be too restrictive or there's no matching data.");
                    setPreviewData([]);
                }
            } catch (error) {
                // Ensure any error messages are sanitized before logging
                const sanitizedError = error.message?.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
                console.error('Error executing query:', sanitizedError);

                // Handle different error types without exposing sensitive information
                if (error.response) {
                    const errorDetail = error.response.data?.detail || "Unknown error occurred";
                    // Sanitize the error message
                    const sanitizedDetail = errorDetail.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
                    toast.error(`Query error: ${sanitizedDetail}`);
                } else if (error.request) {
                    toast.error("No response from server. Check your network connection.");
                } else {
                    toast.error(`Error: ${sanitizedError}`);
                }

                setPreviewData([]);
            }
        } catch (error) {
            // Sanitize any unexpected errors
            const sanitizedError = error.message?.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
            console.error('Unexpected error:', sanitizedError);
            toast.error(`Unexpected error: ${sanitizedError}`);
            setPreviewData([]);
        } finally {
            setPreviewLoading(false);
        }
    };

    // Add function to handle discarding changes
    const handleDiscardChanges = () => {
        // If there are no unsaved changes, just go back
        if (!hasUnsavedChanges) {
            onBack();
            return;
        }

        // Otherwise, open confirmation dialog
        setDiscardConfirmOpen(true);
    };

    // create nếu chưa có, update nếu có
    const handleSaveSegment = () => {
        try {
            console.log('💾 [SegmentBuilder] Saving segment, edit mode:', !!editSegment);

            // Create the segment object with all the current form values
            const segment = {
                id: segmentId,
                name: segmentName,
                dataset: selectedDataset.name,
                description: description,
                last_updated: new Date().toISOString(),
                size: estimatedSize.count,
                status: 'active',
                conditions: conditions,
                conditionGroups: conditionGroups,
                rootOperator: rootOperator
            };

            console.log('📝 [SegmentBuilder] Saving segment:', segment);

            const storedSegments = JSON.parse(localStorage.getItem('segments') || '[]'); //lưu tạm vào localStorage -> nên chuyển qua table db

            if (editSegment) {
                const existingIndex = storedSegments.findIndex(s => s.id === segment.id);

                if (existingIndex >= 0) {
                    storedSegments[existingIndex] = {
                        ...storedSegments[existingIndex],
                        ...segment,
                        last_updated: new Date().toISOString()
                    };

                    console.log('✅ [SegmentBuilder] Updated existing segment in localStorage');
                } else {
                    // Add if it wasn't found (shouldn't happen for edits but just in case)
                    storedSegments.push(segment);
                    console.log('✅ [SegmentBuilder] Added new segment to localStorage (edit not found)');
                }
            } else {
                // This is a new segment, just add it
                storedSegments.push(segment);
                console.log('✅ [SegmentBuilder] Added new segment to localStorage');
            }

            // Save back to localStorage
            localStorage.setItem('segments', JSON.stringify(storedSegments));

            toast.success(`Segment ${editSegment ? 'updated' : 'created'} successfully!`);

            // Reset unsaved changes flag
            setHasUnsavedChanges(false);

            // Send the segment back to the parent component
            console.log('🔄 [SegmentBuilder] Calling onBack with segment:', segment);
            if (onBack) {
                onBack(segment);
            } else {
                console.warn('⚠️ [SegmentBuilder] onBack function is not provided');
            }
        } catch (error) {
            console.error('❌ [SegmentBuilder] Error saving segment:', error);
            toast.error('Failed to save segment. Please try again.');
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => onBack()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    {/* <h1 className="text-xl font-semibold">Segment Builder</h1> */}
                    <Input className="w-auto" value={segmentName} onChange={(e) => setSegmentName(e.target.value)} placeholder="Segment Name" />

                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        className="mx-1 flex items-center"
                        onClick={handleOpenSqlDialog}
                    >
                        <Code className="mr-2 h-4 w-4" />
                        View SQL
                    </Button>

                    <Button
                        variant="outline"
                        className="mx-1"
                        onClick={fetchPreviewData}
                        disabled={previewLoading}
                    >
                        {previewLoading ? 'Loading...' : 'Preview Results'}
                    </Button>

                    <Button
                        variant="outline"
                        className="mx-1"
                        onClick={handleDiscardChanges}
                        disabled={!hasUnsavedChanges}
                    >
                        Discard Changes
                    </Button>

                    <Button
                        variant="default"
                        className="mx-1"
                        onClick={handleSaveSegment}
                        disabled={!hasUnsavedChanges || !segmentName.trim()}
                    >
                        Save Segment
                    </Button>

                    <Button className="ml-1">
                        <EllipsisVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="definition">
                <TabsList>
                    <TabsTrigger value="definition">Definition</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="syncs">Syncs</TabsTrigger>
                    <TabsTrigger value="overlap">Overlap</TabsTrigger>
                </TabsList>

                {/* render definition UI */}
                <TabsContent value="definition">
                    <RenderDefinition
                        generateSQLPreview={generateSQL}
                    />

                </TabsContent>


                <TabsContent value="activity">
                    <h2 className="text-base font-medium">Activity Tab Content</h2>
                    <p className="text-sm">This tab shows activity information.</p>
                </TabsContent>

                <TabsContent value="syncs">
                    <h2 className="text-base font-medium">Syncs Tab Content</h2>
                    <p className="text-sm">This tab shows syncs information.</p>
                </TabsContent>

                <TabsContent value="overlap">
                    <h2 className="text-base font-medium">Overlap Tab Content</h2>
                    <p className="text-sm">This tab shows overlap information.</p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
