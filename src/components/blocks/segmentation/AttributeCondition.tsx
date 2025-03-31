import { FC } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, GripVertical } from "lucide-react";

interface Attribute {
  name: string;
  type: string;
}

interface Operator {
  value: string;
  label: string;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value?: string;
  value2?: string;
}

interface Props {
  condition: Condition;
  attributes: Attribute[];
  OPERATORS: Record<string, Operator[]>;
  isInGroup?: boolean;
  groupId?: string | null;
  handleUpdateCondition: (id: string, key: string, value: string) => void;
  handleUpdateGroupCondition: (groupId: string | null, id: string, key: string, value: string) => void;
  handleRemoveCondition: (id: string) => void;
  handleRemoveGroupCondition: (groupId: string | null, id: string) => void;
}

const AttributeCondition: FC<Props> = ({
  condition,
  attributes,
  OPERATORS,
  isInGroup = false,
  groupId = null,
  handleUpdateCondition,
  handleUpdateGroupCondition,
  handleRemoveCondition,
  handleRemoveGroupCondition,
}) => {
  const attribute = attributes.find((attr) => attr.name === condition.field);
  const attributeType = attribute ? attribute.type : "text";
  const operators = OPERATORS[attributeType] || OPERATORS.text;

  const updateCondition = (key: string, value: string) => {
    if (isInGroup) {
      handleUpdateGroupCondition(groupId, condition.id, key, value);
    } else {
      handleUpdateCondition(condition.id, key, value);
    }
  };

  return (
    <Card className="flex items-center p-3 border rounded-md gap-2">
      <GripVertical className="text-gray-400 cursor-grab" size={16} />

      <Select onValueChange={(value) => updateCondition("field", value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50"/>
          {attributes.map((attr) => (
            <SelectItem key={attr.name} value={attr.name}>
              {attr.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => updateCondition("operator", value)}>
        <SelectTrigger className="w-36" disabled={!condition.field}>
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50"/>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {condition.operator && !["is_null", "is_not_null", "is_empty", "is_not_empty"].includes(condition.operator) && (
        <Input
          placeholder="Value"
          value={condition.value || ""}
          onChange={(e) => updateCondition("value", e.target.value)}
          className="flex-grow"
        />
      )}

      {condition.operator === "between" && (
        <>
          <span className="mx-2">and</span>
          <Input
            placeholder="End value"
            value={condition.value2 || ""}
            onChange={(e) => updateCondition("value2", e.target.value)}
            className="flex-grow"
          />
        </>
      )}

      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          isInGroup ? handleRemoveGroupCondition(groupId, condition.id) : handleRemoveCondition(condition.id)
        }
      >
        <Trash2 size={16} />
      </Button>
    </Card>
  );
};

export default AttributeCondition;