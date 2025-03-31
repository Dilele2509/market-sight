import { Link, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

interface RelatedDatasetConditionProps {
    condition: any;
    isInGroup?: boolean;
    groupId?: string | null;
    relatedOptions: any;
    handleUpdateGroupCondition: (groupId: string | null, conditionId: string, field: string, value: string) => void;
    handleUpdateCondition: (conditionId: string, field: string, value: string) => void;
    handleRemoveGroupCondition: (groupId: string | null, conditionId: string) => void;
    handleRemoveCondition: (conditionId: string) => void;
}

const RelatedDatasetCondition: React.FC<RelatedDatasetConditionProps> = ({
    condition,
    isInGroup = false,
    groupId = null,
    relatedOptions,
    handleUpdateGroupCondition,
    handleUpdateCondition,
    handleRemoveGroupCondition,
    handleRemoveCondition
}) => {
    return (
        <div className="mb-2 border border-gray-300 rounded p-2 bg-gray-100">
            <div className="flex items-center mb-2">
                <Link className="mr-1 text-indigo-500 w-5 h-5" />
                <span className="font-medium mr-2 text-sm">Related to</span>
                <Select
                    value={condition.relatedDataset || ""}
                    onValueChange={(newValue) => {
                        if (isInGroup) {
                            handleUpdateGroupCondition(groupId, condition.id, "relatedDataset", newValue);
                        } else {
                            handleUpdateCondition(condition.id, "relatedDataset", newValue);
                        }
                    }}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select related dataset" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                        <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" value="" disabled>Select related dataset</SelectItem>
                        {relatedOptions.map((dataset) => (
                            <SelectItem key={dataset} value={dataset}>
                                {dataset}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        if (isInGroup) {
                            handleRemoveGroupCondition(groupId, condition.id);
                        } else {
                            handleRemoveCondition(condition.id);
                        }
                    }}
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </div>

            {condition.relatedDataset && (
                <div className="pl-6">
                    <Select
                        value={condition.relation || "where"}
                        onValueChange={(newValue) => {
                            if (isInGroup) {
                                handleUpdateGroupCondition(groupId, condition.id, "relation", newValue);
                            } else {
                                handleUpdateCondition(condition.id, "relation", newValue);
                            }
                        }}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="where" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                            <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" value="where">where</SelectItem>
                            <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" value="having">having</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="mt-2 p-2 bg-gray-200 rounded border border-dashed border-gray-400">
                        <p className="italic text-gray-600 text-sm">
                            Define conditions for {condition.relatedDataset} (nested conditions would go here)
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-1"
                            onClick={() => {
                                toast.info(`Adding nested condition for ${condition.relatedDataset}`);
                            }}
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add related condition
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RelatedDatasetCondition;
