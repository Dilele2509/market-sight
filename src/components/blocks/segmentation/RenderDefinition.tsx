import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Copy, Plus, RefreshCw, Calendar, Link, Users, SlidersHorizontal } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Dataset {
    schema?: string;
}

interface Attribute {
    name: string;
    type: string;
}

interface EstimatedSize {
    count: number;
    percentage: number;
}

interface Condition {
    type: string;
}

interface ConditionGroup {
    id: string;
}

interface SegmentDefinitionProps {
    segmentName: string;
    segmentId: string;
    selectedDataset: string;
    description: string;
    estimatedSize: EstimatedSize;
    attributes: Attribute[];
    datasets: Record<string, Dataset>;
    showDescriptionField: boolean;
    loading: boolean;
    copySuccess: boolean;
    rootOperator: string;
    conditions: Condition[];
    conditionGroups: ConditionGroup[];
    onSegmentNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCopySegmentId: () => void;
    onDatasetChange: (value: string) => void;
    onToggleDescription: () => void;
    onRefreshAttributes: () => void;
    onAttributeClick: (attribute: Attribute) => void;
    handleRootOperatorChange: (value: any) => void;
    renderAttributeCondition: (condition: Condition) => JSX.Element;
    renderEventCondition: (condition: Condition) => JSX.Element;
    renderRelatedDatasetCondition: (condition: Condition) => JSX.Element;
    renderConditionGroup: (group: ConditionGroup) => JSX.Element;
    handleAddCondition: (type: string) => void;
    handleAddRelatedCondition: () => void;
    handleAddConditionGroup: () => void;
}

const RenderDefinition: React.FC<SegmentDefinitionProps> = ({
    segmentName,
    segmentId,
    selectedDataset,
    description,
    estimatedSize,
    attributes,
    datasets,
    showDescriptionField,
    loading,
    copySuccess,
    rootOperator,
    conditions,
    conditionGroups,
    onSegmentNameChange,
    onCopySegmentId,
    onDatasetChange,
    onToggleDescription,
    onRefreshAttributes,
    onAttributeClick,
    handleRootOperatorChange,
    renderAttributeCondition,
    renderEventCondition,
    renderRelatedDatasetCondition,
    renderConditionGroup,
    handleAddCondition,
    handleAddRelatedCondition,
    handleAddConditionGroup,
}) => {
    return (
        <div className="grid grid-cols-10 gap-4">
            <div className="col-span-7 p-4 space-y-4">
                <Card>
                    <CardContent className="space-y-5">
                        <div className="space-y-1">
                            <label className="font-medium">Segment Name</label>
                            <Input value={segmentName} onChange={onSegmentNameChange} className="mt-1" />
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium">Segment Resource ID</label>
                            <div className="relative">
                                <Input value={segmentId} readOnly className="bg-gray-100 cursor-default" />
                                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={onCopySegmentId}>
                                    {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium">Segment of</label>
                            <Select value={selectedDataset} onValueChange={onDatasetChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select dataset" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
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
                        <div className="flex flex-col space-y-1">
                            <label className="font-medium">Description</label>
                            {showDescriptionField ? (
                                <Textarea rows={2} placeholder="Enter description..." value={description} onChange={onToggleDescription} />
                            ) : (
                                <Button className="w-40" variant="outline" onClick={onToggleDescription}>
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
                            <h5>Conditions</h5>
                            <ToggleGroup value={rootOperator} onValueChange={handleRootOperatorChange} type="single" size="sm">
                                <ToggleGroupItem value="AND">AND</ToggleGroupItem>
                                <ToggleGroupItem value="OR">OR</ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Individual conditions */}
                        {conditions.map((condition) => {
                            if (condition.type === "attribute") return renderAttributeCondition(condition);
                            if (condition.type === "event") return renderEventCondition(condition);
                            if (condition.type === "related") return renderRelatedDatasetCondition(condition);
                            return null;
                        })}

                        {/* Condition groups */}
                        {conditionGroups.map((group) => renderConditionGroup(group))}

                        {/* Add buttons */}
                        <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" onClick={() => handleAddCondition("attribute")}>
                                <SlidersHorizontal className="w-4 h-4 mr-2" /> Add attribute condition
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleAddCondition("event")}>
                                <Calendar className="w-4 h-4 mr-2" /> Add event condition
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleAddRelatedCondition}>
                                <Link className="w-4 h-4 mr-2" /> Add related data
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleAddConditionGroup}>
                                <Users className="w-4 h-4 mr-2" /> Add condition group
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div >
            <div className="col-span-3 space-y-4">
                <Card className="p-4">
                    <CardContent>
                        <h4 className="text-2xl font-bold">{estimatedSize.count}</h4>
                        <p className="text-gray-600 text-lg">{estimatedSize.percentage}%</p>
                        <div className="mt-1 flex items-center">
                            <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full rounded-full transition-all" style={{ width: `${estimatedSize.percentage}%` }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border border-gray-300 rounded-lg relative">
                    <CardContent className="p-4">
                        <h5 className="text-md font-semibold">Details List</h5>
                        <Button size="icon" variant="ghost" onClick={onRefreshAttributes} disabled={loading}>
                            <RefreshCw size={16} />
                        </Button>
                        <ScrollArea className="max-h-[350px] overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-sm text-gray-600">Loading attributes...</div>
                            ) : (
                                attributes.map((attr, index) => (
                                    <div key={index} className="p-2 border-b cursor-pointer hover:bg-gray-100" onClick={() => onAttributeClick(attr)}>
                                        <p className="text-sm">{attr.name}</p>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RenderDefinition;
