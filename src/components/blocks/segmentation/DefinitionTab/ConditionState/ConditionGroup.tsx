import { Trash, SlidersHorizontal, Calendar, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Condition {
    id: string;
    type: "attribute" | "event" | "related";
}

interface ConditionGroupProps {
    group: {
        id: string;
        operator: "AND" | "OR";
        conditions: Condition[];
    };
    handleUpdateGroupOperator: (groupId: string, operator: "AND" | "OR") => void;
    handleRemoveConditionGroup: (groupId: string) => void;
    handleAddConditionToGroup: (groupId: string, type: "attribute" | "event" | "related") => void;
    renderAttributeCondition: (condition: Condition, isInGroup: boolean, groupId: string) => JSX.Element | null;
    renderEventCondition: (condition: Condition, isInGroup: boolean, groupId: string) => JSX.Element | null;
    renderRelatedDatasetCondition: (condition: Condition, isInGroup: boolean, groupId: string) => JSX.Element | null;
}

const ConditionGroup: React.FC<ConditionGroupProps> = ({
    group,
    handleUpdateGroupOperator,
    handleRemoveConditionGroup,
    handleAddConditionToGroup,
    renderAttributeCondition,
    renderEventCondition,
    renderRelatedDatasetCondition
}) => {
    return (
        <div className="mb-3 mt-2 border border-gray-300 rounded p-2">
            <div className="flex items-center mb-2">
                <span className="font-medium text-base mr-2">Group of conditions</span>
                <ToggleGroup
                    type="single"
                    value={group.operator}
                    onValueChange={(newValue) => {
                        if (newValue) {
                            handleUpdateGroupOperator(group.id, newValue as "AND" | "OR");
                        }
                    }}
                    className="mr-auto flex gap-1"
                >
                    <ToggleGroupItem
                        value="AND"
                        className={`px-3 text-xs rounded-md transition-all 
                        ${group.operator === "AND"
                                ? "bg-blue-500 text-white shadow-md scale-100"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95"
                            }`}
                    >
                        AND
                    </ToggleGroupItem>

                    <ToggleGroupItem
                        value="OR"
                        className={`px-3 text-xs rounded-md transition-all 
                        ${group.operator === "OR"
                                ? "bg-red-500 text-white shadow-md scale-100"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95"
                            }`}
                    >
                        OR
                    </ToggleGroupItem>
                </ToggleGroup>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveConditionGroup(group.id)}
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </div>

            {/* Group conditions */}
            <div className="pl-2 border-l-4 border-gray-300">
                {group.conditions.map((condition) => {
                    if (condition.type === "attribute") {
                        return renderAttributeCondition(condition, true, group.id);
                    } else if (condition.type === "event") {
                        return renderEventCondition(condition, true, group.id);
                    } else if (condition.type === "related") {
                        return renderRelatedDatasetCondition(condition, true, group.id);
                    }
                    return null;
                })}

                {group.conditions.length === 0 && (
                    <p className="italic text-gray-500 text-sm mb-2">
                        No conditions in this group yet. Add conditions below.
                    </p>
                )}

                <div className="flex gap-2 mt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => handleAddConditionToGroup(group.id, "attribute")}
                    >
                        <SlidersHorizontal className="w-3 h-3 mr-1" /> Add attribute
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => handleAddConditionToGroup(group.id, "event")}
                    >
                        <Calendar className="w-3 h-3 mr-1" /> Add event
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => handleAddConditionToGroup(group.id, "related")}
                    >
                        <Link className="w-3 h-3 mr-1" /> Add related
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConditionGroup;
