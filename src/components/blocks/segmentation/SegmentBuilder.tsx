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


export default function SegmentBuilder({ onBack, editSegment }: SegmentBuilderProps) {
    const isEditMode = !!editSegment;
    const [segmentName, setSegmentName] = useState<string>(editSegment?.name || "High Value Users (new)");
    const [segmentId, setSegmentId] = useState<string>(editSegment?.id || "segment:high-value-users-new");
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedDataset, setSelectedDataset] = useState<string>(
        editSegment?.dataset || "Customer Profile"
    );

    const [datasets, setDatasets] = useState({
        "Customer Profile": { name: "customers", description: "Customer information", fields: [], schema: "public" },
        "Transactions": { name: "transactions", description: "Transaction records", fields: [], schema: "public" },
        "Stores": { name: "stores", description: "Store information", fields: [], schema: "public" },
        "Product Line": { name: "product_lines", description: "Product information", fields: [], schema: "public" },
        "Events": { name: "events", description: "User event data", fields: [], schema: "public" }
    });

    // New states for preview
    const [previewData, setPreviewData] = useState([]);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    // Conditions state
    const [rootOperator, setRootOperator] = useState(editSegment?.rootOperator || "AND");

    const [conditions, setConditions] = useState(
        editSegment?.conditions || [
            {
                id: 1,
                type: "attribute",
                field: "email",
                operator: "is_not_null",
                value: null
            }
        ]
    );
    const [conditionGroups, setConditionGroups] = useState(
        editSegment?.conditionGroups || [
            {
                id: 2,
                type: "group",
                operator: "AND",
                conditions: [
                    {
                        id: 3,
                        type: "event",
                        eventType: "performed",
                        eventName: "New Canvas",
                        frequency: "at_least",
                        count: 3,
                        timePeriod: "days",
                        timeValue: 90
                    }
                ]
            }
        ]
    );

    // Add this new state to track if there are unsaved changes
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [initialConditions, setInitialConditions] = useState([]);
    const [initialConditionGroups, setInitialConditionGroups] = useState([]);
    const [initialRootOperator, setInitialRootOperator] = useState('AND');
    const [initialSegmentName, setInitialSegmentName] = useState('High Value Users (new)');
    const [initialDescription, setInitialDescription] = useState('');
    const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
    const [description, setDescription] = useState<string>(editSegment?.description || "");
    const [estimatedSize, setEstimatedSize] = useState(
        editSegment
            ? { count: editSegment.size, percentage: Math.round((editSegment.size / 400) * 100) }
            : { count: 88, percentage: 22 }
    );


    // Add these new states for SQL editing
    const [sqlDialogOpen, setSqlDialogOpen] = useState(false);
    const [editableSql, setEditableSql] = useState('');
    const [sqlError, setSqlError] = useState(null);

    useEffect(() => {
        const slug = segmentName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
        setSegmentId(`segment:${slug}`);
    }, [segmentName]);

    const handleFetchDatasets = useCallback(async () => {
        setLoading(true);
        try {
            await axios.get(`/datasources/postgres/tables`);
            toast.success("Datasets loaded successfully");
        } catch (error) {
            toast.error("Failed to fetch datasets");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleFetchDatasets();
    }, [handleFetchDatasets]);

    //SQL Preview
    const generateSQL = () => {
        return generateSQLPreview(datasets, selectedDataset, conditions, attributes, rootOperator)
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
            const sqlQuery = generateSQLPreview(datasets, selectedDataset, conditions, attributes, rootOperator);

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
                    table: datasets[selectedDataset].name,
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

    // Update the handleSaveSegment function to pass the new segment data back to the parent component
    const handleSaveSegment = () => {
        try {
            console.log('💾 [SegmentBuilder] Saving segment, edit mode:', !!editSegment);

            // Create the segment object with all the current form values
            const segment = {
                id: segmentId,
                name: segmentName,
                dataset: selectedDataset,
                description: description,
                last_updated: new Date().toISOString(),
                size: estimatedSize.count,
                status: 'active',
                conditions: conditions,
                conditionGroups: conditionGroups,
                rootOperator: rootOperator
            };

            console.log('📝 [SegmentBuilder] Saving segment:', segment);

            // Get existing segments from localStorage
            const storedSegments = JSON.parse(localStorage.getItem('segments') || '[]');

            // If this is an edit, update the existing segment
            if (editSegment) {
                // Find if this segment already exists in localStorage
                const existingIndex = storedSegments.findIndex(s => s.id === segment.id);

                if (existingIndex >= 0) {
                    // Update the existing segment by completely replacing it
                    storedSegments[existingIndex] = {
                        ...storedSegments[existingIndex],  // keep any properties we might not have changed
                        ...segment,  // override with all our new values
                        last_updated: new Date().toISOString()  // ensure timestamp is updated
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


    // PREVIEW
    const handleClosePreview = () => {
        setPreviewOpen(false);
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
                <div className="flex items-center">
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
                        sqlError={sqlError}
                        editSegment={editSegment}
                        segmentName={segmentName}
                        segmentId={segmentId}
                        previewOpen={previewOpen}
                        previewData={previewData}
                        previewLoading={previewLoading}
                        selectedDataset={selectedDataset}
                        datasets={datasets}
                        editableSql={editableSql}
                        sqlDialogOpen={sqlDialogOpen}
                        setSqlError={setSqlError}
                        setSelectedDataset={setSelectedDataset}
                        setDatasets={setDatasets}
                        setSegmentName={setSegmentName}
                        setSegmentId={setSegmentId}
                        setEditableSql={setEditableSql}
                        setSqlDialogOpen={setSqlDialogOpen}
                        generateSQLPreview={generateSQL}
                        handleClosePreview={handleClosePreview}
                        discardConfirmOpen={discardConfirmOpen}
                        setDiscardConfirmOpen={setDiscardConfirmOpen}
                        setHasUnsavedChanges={setHasUnsavedChanges}
                        initialConditions={initialConditions}
                        initialConditionGroups={initialConditionGroups}
                        initialRootOperator={initialRootOperator}
                        initialSegmentName={initialSegmentName}
                        initialDescription={initialDescription}
                        description = {description}
                        setDescription = {setDescription}
                        estimatedSize = {estimatedSize}
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
