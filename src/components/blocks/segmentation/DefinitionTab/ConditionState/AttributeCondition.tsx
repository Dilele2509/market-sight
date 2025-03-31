import { GripVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Attribute {
  name: string;
  type: string;
}

interface Operator {
  value: string;
  label: string;
}

interface Condition {
  id: number;
  type?: string;
  field?: string;
  operator?: string;
  value?: any;
  value2?: any;
}

interface AttributeConditionProps {
  condition: Condition;
  attributes: Attribute[];
  operators: Operator[];
  isInGroup?: boolean;
  groupId?: number;
  handleUpdateCondition: (id: number, key: string, value: string) => void;
  handleUpdateGroupCondition?: (groupId: number, id: number, key: string, value: string) => void;
  handleRemoveCondition: (id: number) => void;
  handleRemoveGroupCondition?: (groupId: number, id: number) => void;
}

const AttributeCondition: React.FC<AttributeConditionProps> = ({
  condition,
  attributes,
  operators,
  isInGroup,
  groupId,
  handleUpdateCondition,
  handleUpdateGroupCondition,
  handleRemoveCondition,
  handleRemoveGroupCondition,
}) => {
  const updateCondition = (key: string, value: string) => {
    if (isInGroup && groupId !== undefined && handleUpdateGroupCondition) {
      handleUpdateGroupCondition(groupId, condition.id, key, value);
    } else {
      handleUpdateCondition(condition.id, key, value);
    }
  };

  const removeCondition = () => {
    if (isInGroup && groupId !== undefined && handleRemoveGroupCondition) {
      handleRemoveGroupCondition(groupId, condition.id);
    } else {
      handleRemoveCondition(condition.id);
    }
  };

  return (
    <div className="mb-2 flex items-center rounded border border-gray-300 p-3">
      <GripVertical className="mr-2 text-gray-400 cursor-grab" size={20} />

      {/* Field select */}
      <Select
        value={condition.field || ""}
        onValueChange={(newValue) => updateCondition("field", newValue)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select field">
            {condition.field
              ? attributes.find((attr) => attr.name === condition.field)?.name || "No attribute"
              : "Select field"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
          {attributes.length > 0 ? (
            attributes.map((attr) => (
              <SelectItem key={attr.name} value={attr.name} className="hover:bg-background hover:rounded-md cursor-pointer">
                <div className="flex items-center">
                  <span className="mr-2 w-5 text-gray-500">
                    {attr.type === "number"
                      ? "#"
                      : attr.type === "datetime"
                        ? "⏱"
                        : attr.type === "boolean"
                          ? "✓"
                          : attr.type === "array"
                            ? "[]"
                            : "T"}
                  </span>
                  {attr.name}
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no attribute" disabled className="text-gray-400">
              No attributes available
            </SelectItem>
          )}
        </SelectContent>
      </Select>


      {/* Operator select */}
      <Select value={condition.operator || ""} onValueChange={(newValue) => updateCondition("operator", newValue)} disabled={!condition.field}>
        <SelectTrigger className="w-[140px] ml-2">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value} className="hover:bg-background hover:rounded-md cursor-pointer">
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value input */}
      {condition.operator && !["is_null", "is_not_null", "is_empty", "is_not_empty"].includes(condition.operator) && (
        <Input
          placeholder="Value"
          value={condition.value || ""}
          onChange={(e) => updateCondition("value", e.target.value)}
          className="ml-2 flex-grow"
        />
      )}

      {/* Additional value input for "between" operator */}
      {condition.operator === "between" && (
        <>
          <span className="mx-2 text-sm">and</span>
          <Input
            placeholder="End value"
            value={condition.value2 || ""}
            onChange={(e) => updateCondition("value2", e.target.value)}
            className="flex-grow"
          />
        </>
      )}

      {/* Delete button */}
      <Button variant="ghost" size="icon" className="ml-2" onClick={removeCondition}>
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AttributeCondition;
