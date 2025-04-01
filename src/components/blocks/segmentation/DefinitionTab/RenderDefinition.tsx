import { useState, useEffect, useCallback } from "react";
import axios from "@/API/axios";
import { toast } from "sonner";
import { ReactSortable } from "react-sortablejs";

import { Code, Check, Copy, Plus, RefreshCw, Calendar, Link, Users, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { OPERATORS } from "@/types/constant";

import { EventCondition, ConditionGroup, RelatedDatasetCondition, AttributeCondition } from "./ConditionState";
import { InclusionExclusion, SegmentSelectorDialog } from "./InclusionExclusionState";
import { SQLDialog, SQLPreview } from "./SQLState";
import { DiscardConfirmDialog, PreviewDialog } from "./InforSetupState";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { useSegmentData } from "@/context/SegmentDataContext";


interface SegmentDefinitionProps {
    generateSQLPreview?: () => string;
}


const RenderDefinition: React.FC<SegmentDefinitionProps> = ({
    generateSQLPreview,
}) => {
    const { datasets,
        setDatasets,
        segmentName,
        setSegmentName,
        setSegmentId,
        selectedDataset,
        conditions,
        attributes,
        rootOperator,
        segmentId,
        description,
        estimatedSize,
        conditionGroups,
        previewData,
        setSelectedDataset,
        setDescription,
        setAttributes,
        setConditions,
        setRootOperator,
        setConditionGroups,
        relatedDatasets, } = useSegmentData();

    const { setLoading,
        loading,
        setCopySuccess,
        copySuccess,
        showDescriptionField,
        setShowDescriptionField } = useSegmentToggle();


    //fetch api data
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

    const fetchAttributes = async (datasetName, forceRefresh = false, showToast = true) => {
        try {
            setLoading(true);

            const tableInfo = datasets[datasetName];

            if (!tableInfo) {
                if (showToast) {
                    toast.error(`Table information for ${datasetName} not found`);
                }
                setLoading(false);
                return;
            }

            // If we already have fields from the initial fetch AND we're not forcing a refresh, use those
            if (!forceRefresh && tableInfo.fields && Array.isArray(tableInfo.fields) && tableInfo.fields.length > 0) {
                const formattedAttributes = tableInfo.fields.map(field => ({
                    name: field,
                    type: determineFieldType(field)
                }));

                setAttributes(formattedAttributes);
                setLoading(false);
                return;
            }

            // If fields aren't available or we're forcing a refresh, fetch them from the API
            const connectionUrl = process.env.REACT_APP_CONNECTION_URL ||
                process.env.SEGMENTATION_URL ||
                localStorage.getItem('postgres_connection');

            if (!connectionUrl) {
                if (showToast) {
                    toast.error("Connection URL not configured. Please set the connection URL in your settings or environment variables.");
                }
                setLoading(false);
                return;
            }

            try {
                const url = new URL(connectionUrl);
                const tableName = tableInfo.name.toLowerCase();

                // Parse the connection URL to get individual components
                const username = url.username;
                const password = url.password;
                const host = url.hostname;
                const port = url.port;
                const database = url.pathname.replace('/', '');

                console.log(`Fetching columns for ${tableName}...`);

                // Fetch columns for the specific table
                const response = await axios.get(`/datasources/postgres/tables`, {
                    params: {
                        host: host,
                        port: port,
                        database: database,
                        username: username,
                        password: password,
                        table: tableName
                    }
                });

                // Find the table in the response
                const tableData = response.data.find(table =>
                    table.table_name.toLowerCase() === tableName
                );

                if (tableData && Array.isArray(tableData.columns) && tableData.columns.length > 0) {
                    // Update the dataset information with the columns
                    setDatasets(prevDatasets => ({
                        ...prevDatasets,
                        [datasetName]: {
                            ...prevDatasets[datasetName],
                            fields: tableData.columns
                        }
                    }));

                    // Create formatted attributes from the column data
                    const formattedAttributes = tableData.columns.map(field => ({
                        name: field,
                        type: determineFieldType(field)
                    }));

                    setAttributes(formattedAttributes);

                    // Only show success toast if requested
                    if (showToast) {
                        toast.success(`Loaded ${formattedAttributes.length} fields for ${datasetName}`);
                    }
                } else {
                    setAttributes([]);
                    if (showToast) {
                        toast.warning(`No fields found for ${datasetName}. The table might be empty.`);
                    }
                }
            } catch (error) {
                console.error(`Error fetching columns for ${datasetName}:`, error);
                const sanitizedError = error.message?.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');

                if (showToast) {
                    toast.error(`Failed to load fields: ${sanitizedError}`);
                }
                setAttributes([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error in fetchAttributes:', error);
            if (showToast) {
                toast.error(`Failed to load attributes for ${datasetName}`);
            }
            setLoading(false);
            setAttributes([]);
        }
    };

    //function define type
    const determineFieldType = (fieldName, dataType = null) => {
        // If we have the actual data type from PostgreSQL, use it
        if (dataType) {
            // Convert PostgreSQL data types to our field types
            if (dataType.includes('timestamp') || dataType.includes('date') || dataType.includes('time')) {
                return 'datetime';
            } else if (dataType.includes('int') || dataType.includes('float') || dataType.includes('numeric') || dataType.includes('decimal') || dataType.includes('double')) {
                return 'number';
            } else if (dataType === 'boolean') {
                return 'boolean';
            } else if (dataType.includes('array') || dataType.includes('json') || dataType.includes('jsonb')) {
                return 'array';
            } else {
                return 'text';
            }
        }

        // Fallback to field name heuristics
        const lowerField = fieldName.toLowerCase();

        if (lowerField.includes('date') || lowerField.includes('time') || lowerField.includes('_at')) {
            return 'datetime';
        } else if (
            lowerField.includes('id') ||
            lowerField.includes('amount') ||
            lowerField.includes('price') ||
            lowerField.includes('cost') ||
            lowerField.includes('quantity') ||
            lowerField.includes('number')
        ) {
            return 'number';
        } else if (lowerField.includes('is_') || lowerField.includes('has_')) {
            return 'boolean';
        } else if (lowerField.includes('tags') || lowerField.includes('categories') || lowerField.includes('array')) {
            return 'array';
        } else {
            return 'text';
        }
    };
    useEffect(() => {
        const slug = segmentName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
        setSegmentId(`segment:${slug}`);
    }, [segmentName]);


    //handle changes
    const handleDatasetChange = (value: string) => {
        console.log("Dataset changed to:", value);
        setSelectedDataset(value);
    };
    const handleRootOperatorChange = (newValue) => {
        if (newValue !== null) {
            setRootOperator(newValue);
        }
    };


    //handle onclick
    const handleCopySegmentId = () => {
        navigator.clipboard.writeText(segmentId)
            .then(() => {
                setCopySuccess(true);
                toast.success('Segment ID copied to clipboard');

                setTimeout(() => {
                    setCopySuccess(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                toast.error('Failed to copy to clipboard');
            });
    };
    const handleAttributeClick = (attribute) => {
        const newId = Math.max(...conditions.map(c => c.id), ...conditionGroups.map(g => g.id), 0) + 1;

        const newCondition = {
            id: newId,
            type: 'attribute',
            field: attribute.name,
            operator: getDefaultOperatorForType(attribute.type),
            value: null
        };

        setConditions([...conditions, newCondition]);
        toast.info(`Added condition for "${attribute.name}"`);
    };
    const getDefaultOperatorForType = (type) => {
        switch (type) {
            case 'text': return 'equals';
            case 'number': return 'equals';
            case 'datetime': return 'after';
            case 'boolean': return 'equals';
            case 'array': return 'contains';
            default: return 'equals';
        }
    };

    //for condition state
    const handleAddCondition = (type = 'attribute') => {
        const newId = Math.max(...conditions.map(c => c.id), ...conditionGroups.map(g => g.id), 0) + 1;

        if (type === 'attribute') {
            setConditions([
                ...conditions,
                {
                    id: newId,
                    type: 'attribute',
                    field: '',
                    operator: '',
                    value: null
                }
            ]);
        } else if (type === 'event') {
            setConditions([
                ...conditions,
                {
                    id: newId,
                    type: 'event',
                    eventType: 'performed',
                    eventName: '',
                    frequency: 'at_least',
                    count: 1,
                    timePeriod: 'days',
                    timeValue: 30
                }
            ]);
        }
    };
    const handleAddConditionGroup = () => {
        const newId = Math.max(...conditions.map(c => c.id), ...conditionGroups.map(g => g.id), 0) + 1;

        setConditionGroups([
            ...conditionGroups,
            {
                id: newId,
                type: 'group',
                operator: 'AND',
                conditions: []
            }
        ]);
    };
    const handleAddRelatedCondition = () => {
        const newId = Math.max(...conditions.map(c => c.id), ...conditionGroups.map(g => g.id), 0) + 1;

        setConditions([
            ...conditions,
            {
                id: newId,
                type: 'related',
                relatedDataset: '',
                relation: 'where',
                nestedConditions: []
            }
        ]);
    };
    const handleUpdateGroupCondition = (groupId, conditionId, field, value) => {
        setConditionGroups(conditionGroups.map(group => {
            if (group.id === groupId) {
                const updatedConditions = group.conditions.map(condition => {
                    if (condition.id === conditionId) {
                        return { ...condition, [field]: value };
                    }
                    return condition;
                });

                return { ...group, conditions: updatedConditions };
            }
            return group;
        }));
    };
    const handleRemoveGroupCondition = (groupId, conditionId) => {
        setConditionGroups(conditionGroups.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    conditions: group.conditions.filter(condition => condition.id !== conditionId)
                };
            }
            return group;
        }));
    };
    const handleRemoveCondition = (id) => {
        setConditions(conditions.filter(condition => condition.id !== id));
    };
    const handleUpdateCondition = (id, field, value) => {
        setConditions(conditions.map(condition => {
            if (condition.id === id) {
                return { ...condition, [field]: value };
            }
            return condition;
        }));
    };

    //render function
    const renderAttributeCondition = (condition, isInGroup = false, groupId = null) => {
        const attribute = attributes.find((attr) => attr.name === condition.field);
        const attributeType = attribute ? attribute.type : "text";
        const operators = OPERATORS[attributeType] || OPERATORS.text;

        return (
            // <ReactSortable list={conditions} setList={setConditions} animation={200} className="space-y-2">
            //     {conditions.map((condition) => (
            <AttributeCondition
                key={condition.id}
                condition={condition}
                attributes={attributes}
                operators={operators}
                isInGroup={isInGroup}
                groupId={groupId}
                handleUpdateCondition={handleUpdateCondition}
                handleUpdateGroupCondition={handleUpdateGroupCondition}
                handleRemoveCondition={handleRemoveCondition}
                handleRemoveGroupCondition={handleRemoveGroupCondition}
            />
            //     ))}
            // </ReactSortable>
        );
    };
    const renderEventCondition = (condition, isInGroup = false, groupId = null) => {
        return (<EventCondition
            condition={condition}
            isInGroup={isInGroup}
            groupId={groupId}
            handleUpdateCondition={handleUpdateCondition}
            handleRemoveCondition={handleRemoveCondition}
            handleUpdateGroupCondition={handleUpdateGroupCondition}
            handleRemoveGroupCondition={handleRemoveGroupCondition}
        />)
    }
    const renderRelatedDatasetCondition = (condition, isInGroup = false, groupId = null) => {
        const relatedOptions = relatedDatasets[selectedDataset] || [];

        return (
            <RelatedDatasetCondition
                condition={condition}
                isInGroup={isInGroup}
                groupId={groupId}
                relatedOptions={relatedOptions}
                handleUpdateGroupCondition={handleUpdateGroupCondition}
                handleUpdateCondition={handleUpdateCondition}
                handleRemoveGroupCondition={handleRemoveGroupCondition}
                handleRemoveCondition={handleRemoveCondition}
            />
        );
    };
    const renderConditionGroup = (group) => {
        return (
            <ConditionGroup
                group={group}
                renderAttributeCondition={renderAttributeCondition}
                renderEventCondition={renderEventCondition}
                renderRelatedDatasetCondition={renderRelatedDatasetCondition}
            />
        );
    };
    const renderPreviewDialog = () => {
        // Determine columns based on the first result row
        const columns = previewData.length > 0
            ? Object.keys(previewData[0]).filter(col => col !== '__rowid__')
            : [];

        return (
            <PreviewDialog
                columns={columns}
                generateSQLPreview={generateSQLPreview}
            />
        );
    };

    return (
        <div className="grid grid-cols-10 gap-4">
            <div className="col-span-7 p-4 space-y-4">
                <Card className="p-4">
                    <CardContent className="space-y-5">
                        {/* Segment Name */}
                        <div className="space-y-1">
                            <label className="font-medium">Segment Name</label>
                            <Input value={segmentName} onChange={(e) => setSegmentName(e.target.value)} className="mt-1" />
                        </div>

                        {/* Segment Resource ID */}
                        <div className="space-y-1">
                            <label className="font-medium">Segment Resource ID</label>
                            <div className="relative">
                                <Input value={segmentId} readOnly className="bg-gray-100 cursor-default" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    onClick={handleCopySegmentId}
                                >
                                    {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Segment of */}
                        <div className="space-y-1">
                            <label className="font-medium">Segment of</label>
                            <Select value={selectedDataset} onValueChange={handleDatasetChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select dataset" />
                                </SelectTrigger>
                                <SelectContent className="z-[9999] bg-card border border-card-foreground shadow-lg rounded-md">
                                    {Object.entries(datasets).map(([name, info]) => (
                                        <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={name} value={name}>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 rounded-md text-gray-600">
                                                    {name.charAt(0)}
                                                </span>
                                                <div>
                                                    {name}
                                                    {info.schema && info.schema !== "public" && (
                                                        <span className="text-sm text-gray-500"> ({info.schema})</span>
                                                    )}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-medium">Description</label>
                            {showDescriptionField ? (
                                <Textarea
                                    rows={2}
                                    placeholder="Enter description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            ) : (
                                <Button className="w-40" variant="outline" onClick={() => setShowDescriptionField(true)}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Description
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-4 p-4">
                    <CardContent>
                        {/* Condition builder header */}
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold">Conditions</h2>
                            <ToggleGroup
                                value={rootOperator}
                                onValueChange={handleRootOperatorChange}
                                type="single"
                                size="sm"
                                className="flex gap-2"
                            >
                                <ToggleGroupItem
                                    value="AND"
                                    className={`px-4 py-1 rounded-lg transition-all ${rootOperator === "AND" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    AND
                                </ToggleGroupItem>

                                <ToggleGroupItem
                                    value="OR"
                                    className={`px-4 py-2 rounded-lg transition-all ${rootOperator === "OR" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    OR
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Individual conditions */}
                        <div className="space-y-4">
                            <ReactSortable list={conditions} setList={setConditions} animation={200} className="space-y-2">
                                {conditions.map((condition) => {
                                    if (condition.type === "attribute") return renderAttributeCondition(condition);
                                    if (condition.type === "event") return renderEventCondition(condition);
                                    if (condition.type === "related") return renderRelatedDatasetCondition(condition);
                                    return null;
                                })}
                            </ReactSortable>
                        </div>


                        {/* Condition groups */}
                        {conditionGroups.map((group) => renderConditionGroup(group))}

                        {/* Add buttons */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                className="px-2 py-1 text-xs w-auto"
                                onClick={() => handleAddCondition("attribute")}
                            >
                                <SlidersHorizontal className="w-3 h-3 mr-1" /> Add attribute condition
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="px-2 py-1 text-xs w-auto"
                                onClick={() => handleAddCondition("event")}
                            >
                                <Calendar className="w-3 h-3 mr-1" /> Add event condition
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="px-2 py-1 text-xs w-auto"
                                onClick={handleAddRelatedCondition}
                            >
                                <Link className="w-3 h-3 mr-1" /> Add related condition
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="px-2 py-1 text-xs w-auto"
                                onClick={handleAddConditionGroup}
                            >
                                <Users className="w-3 h-3 mr-1" /> Add condition group
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-4 p-4">
                    {/* Inclusion/Exclusion section */}
                    <CardContent>
                        <InclusionExclusion />
                    </CardContent>
                    <SegmentSelectorDialog />
                </Card>

                <Card className="mb-4 p-4 border border-gray-300 bg-gray-100 rounded-md font-mono whitespace-pre-wrap">
                    <CardContent>
                        <SQLPreview />
                    </CardContent>
                </Card>

                {/* Preview results dialog */}
                {renderPreviewDialog()}

                {/* SQL Editor dialog */}
                <SQLDialog />

                {/* Discard confirmation dialog */}
                <DiscardConfirmDialog />

            </div >
            <div className="col-span-3 space-y-4">
                {/* Estimate */}
                <Card className="p-4">
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 flex items-center font-medium">
                                ESTIMATED SIZE
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="ml-1 bg-gray-300 text-xs flex items-center justify-center w-5 h-5 rounded-full font-bold text-gray-700">
                                            i
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Estimated number of records in this segment based on your current conditions
                                    </TooltipContent>
                                </Tooltip>
                            </p>
                        </div>

                        <div className="mt-3 space-y-2">
                            <h4 className="text-2xl font-bold">{estimatedSize.count}</h4>
                            <p className="text-gray-600 text-lg">{estimatedSize.percentage}%</p>
                        </div>

                        <div className="mt-1 flex items-center">
                            <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-red-500 h-full rounded-full transition-all"
                                    style={{ width: `${estimatedSize.percentage}%` }}
                                />
                            </div>
                            <p className="ml-3 text-sm font-medium text-red-500">-54%</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Details List Card */}
                <Card className="border border-gray-300 rounded-lg relative">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <h5 className="text-md font-semibold">Details List</h5>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => fetchAttributes(selectedDataset, true, true)}
                                disabled={loading}
                            >
                                <RefreshCw size={16} />
                            </Button>
                        </div>
                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                                <p className="text-sm text-gray-600">Loading attributes...</p>
                            </div>
                        )}
                        <div className="border border-gray-300 rounded-md overflow-hidden mt-2">
                            <div className="p-2 bg-gray-100 border-b border-gray-300">
                                <div className="flex items-center mb-1">
                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-sm font-semibold text-gray-700 rounded-md mr-2">
                                        {selectedDataset ? selectedDataset.charAt(0) : 'U'}
                                    </span>
                                    <span className="flex-grow flex justify-between items-center text-sm font-medium text-gray-900">
                                        {selectedDataset} Attributes
                                        <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-sm font-semibold text-gray-700 rounded-md">
                                            {attributes.length}
                                        </span>
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500">A condition on an attribute of {selectedDataset}</p>
                            </div>
                            <ScrollArea className="max-h-[350px] overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-sm text-gray-600">Loading attributes...</div>
                                ) : attributes.length > 0 ? (
                                    <>
                                        {attributes.map((attr, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleAttributeClick(attr)}
                                            >
                                                <span className="w-5 text-gray-500 text-sm">
                                                    {attr.type === "number" ? "#" :
                                                        attr.type === "datetime" ? "⏱" :
                                                            attr.type === "boolean" ? "✓" :
                                                                attr.type === "array" ? "[]" : "T"}
                                                </span>
                                                <p className="text-sm">{attr.name}</p>
                                            </div>
                                        ))}
                                        <div className="flex items-center p-2 border-t cursor-pointer hover:bg-gray-100">
                                            <span className="w-5 text-gray-500 flex items-center justify-center">
                                                <Code size={16} />
                                            </span>
                                            <p className="text-sm text-gray-600">SQL Condition</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-600">No attributes available for this table</div>
                                )}
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RenderDefinition;
