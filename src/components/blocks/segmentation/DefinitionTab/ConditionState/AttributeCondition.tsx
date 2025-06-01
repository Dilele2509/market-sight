import { GripVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { translateLabelToVietnamese } from "@/utils/segmentFunctionHelper";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { fieldMappings, vietnamProvinces } from "@/utils/fieldMappings";

interface Attribute {
  name: string;
  type: string;
}

interface Operator {
  value: string;
  label: string;
}

export interface AttributeCondition {
  id: number;
  type?: string;
  field?: string;
  operator?: string;
  value?: any;
  value2?: any;
}

interface AttributeConditionProps {
  condition: AttributeCondition;
  attributes: Attribute[];
  operators: Operator[];
  isInGroup?: boolean;
  groupId?: number;
  handleUpdateCondition: (id: number, key: string, value: string) => void;
  handleUpdateGroupCondition?: (groupId: number, id: number, key: string, value: string) => void;
  handleRemoveCondition: (id: number) => void;
  handleRemoveGroupCondition?: (groupId: number, id: number) => void;
}

const GENDER_MAP: { [key: string]: string } = {
  'nữ': 'F',
  'phụ nữ': 'F',
  'gái': 'F',
  'con gái': 'F',
  'female': 'F',
  'f': 'F',
  'femal': 'F', // Handle potential typo
  'woman': 'F',
  'nam': 'M',
  'đàn ông': 'M',
  'trai': 'M',
  'con trai': 'M',
  'male': 'M',
  'm': 'M',
  'man': 'M',
};

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
  useEffect(() => {
    if (condition.field && !condition.operator && operators.length > 0) {
      updateCondition("operator", operators[0].value)
    }
  }, [condition.field, condition.operator, operators])

  // Log condition.value changes for debugging
  useEffect(() => {
    console.log(`Condition ${condition.id} value updated:`, condition.value);
  }, [condition.value, condition.id]);

  const updateCondition = (key: string, value: any) => {
    let processedValue = value;

    // Find mapping for the current field if updating 'value'
    if (key === 'value' && condition.field) {
      const fieldName = condition.field.toLowerCase();
      const mapping = fieldMappings.find(m => m.field === fieldName);

      if (mapping && mapping.map) { // Check if mapping and map exist
        const lowerCaseValue = String(value).toLowerCase();
        if (mapping.map[lowerCaseValue] !== undefined) {
          processedValue = mapping.map[lowerCaseValue];
        } else {
          // Optional: Add specific handling for common single letters like 'f'/'m' if needed
          // based on the field type or a generic check
           if (fieldName === 'gender') {
             if (lowerCaseValue === 'f') processedValue = 'F';
             else if (lowerCaseValue === 'm') processedValue = 'M';
           }
           // Otherwise, keep the original value as entered if not a recognized term in the map
           else processedValue = value;
        }
      } else {
          // If no specific mapping found for the field, use the value directly
          processedValue = value;
      }
    }

    if (isInGroup && groupId !== undefined && handleUpdateGroupCondition) {
      handleUpdateGroupCondition(groupId, condition.id, key, processedValue);
    } else {
      handleUpdateCondition(condition.id, key, processedValue);
    }
  };

  const removeCondition = () => {
    if (isInGroup && groupId !== undefined && handleRemoveGroupCondition) {
      handleRemoveGroupCondition(groupId, condition.id);
    } else {
      handleRemoveCondition(condition.id);
    }
  };

  const getAttributeType = () => {
    const attribute = attributes.find(attr => attr.name === condition.field);
    return attribute?.type || 'text';
  };

  const renderValueInput = () => {
    const attributeType = getAttributeType();
    const operator = condition.operator;
    const fieldName = condition.field?.toLowerCase();

    if (["is_null", "is_not_null", "is_empty", "is_not_empty"].includes(operator)) {
      return null;
    }

    // Handle Gender dropdown
    if (fieldName === 'gender') {
        // Only allow 'equals' and 'not_equals' operators for gender dropdown
        if (!['equals', 'not_equals'].includes(operator)) {
            // Maybe return a disabled input or a message indicating invalid operator
            return <Input className="ml-2 flex-grow" value="N/A - Chọn toán tử khác" disabled />;
        }
        return (
            <Select
                value={condition.value || undefined}
                onValueChange={(newValue) => updateCondition("value", newValue)}
            >
                <SelectTrigger className="w-[100px] ml-2">
                    <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    <SelectItem value="F" className="hover:bg-background hover:rounded-md cursor-pointer">F</SelectItem>
                    <SelectItem value="M" className="hover:bg-background hover.rounded-md cursor-pointer">M</SelectItem>
                </SelectContent>
            </Select>
        );
    }

    // Handle Category dropdown
    if (fieldName === 'category') {
        // Define category options
        const categoryOptions = ['Electronics', 'Software', 'Accessories'];
        // Only allow 'equals' and 'not_equals' operators for category dropdown
        if (!['equals', 'not_equals', 'contains', 'not_contains'].includes(operator)) {
             return <Input className="ml-2 flex-grow" value="N/A - Chọn toán tử khác" disabled />;
        }
        return (
            <Select
                value={condition.value || undefined}
                onValueChange={(newValue) => updateCondition("value", newValue)}
            >
                <SelectTrigger className="w-[180px] ml-2">
                    <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    {categoryOptions.map(category => (
                        <SelectItem key={category} value={category} className="hover:bg-background hover:rounded-md cursor-pointer">
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    // Handle City dropdown
    if (fieldName === 'city') {
      return (
        <Select
          value={condition.value || undefined}
          onValueChange={(newValue) => updateCondition("value", newValue)}
        >
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Chọn tỉnh/thành phố" />
          </SelectTrigger>
          <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
            {vietnamProvinces.map((province) => (
              <SelectItem key={province} value={province} className="hover:bg-background hover:rounded-md cursor-pointer">
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Handle Datetime input/picker
    if (attributeType === 'datetime') {
      const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'value' | 'value2') => {
        let input = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits

        if (input.length > 8) { // Max length for yyyyMMdd is 8 digits
          input = input.slice(0, 8);
        }

        let formattedInput = input;
        if (input.length > 4) {
          formattedInput = input.slice(0, 4) + '-' + input.slice(4);
        }
        if (input.length > 6) { // Check length of original input, not formatted
          formattedInput = formattedInput.slice(0, 7) + '-' + formattedInput.slice(7);
        }

        updateCondition(field, formattedInput);
      };

      if (operator === 'between') {
        return (
          <>
            <div className="ml-2 flex items-center flex-grow">
              <Input
                placeholder="YYYY-MM-DD"
                value={condition.value || ""}
                onChange={(e) => handleDateInputChange(e, 'value')}
                className="flex-grow"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="ml-2 h-9 w-9 shrink-0 px-0"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={condition.value ? new Date(condition.value) : undefined}
                    onSelect={(date) => updateCondition("value", date ? format(date, "yyyy-MM-dd") : "")}
                    initialFocus
                    fromYear={1900}
                    toYear={2100}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <span className="mx-2 text-sm">và</span>
            <div className="flex items-center flex-grow">
              <Input
                placeholder="YYYY-MM-DD"
                value={condition.value2 || ""}
                onChange={(e) => handleDateInputChange(e, 'value2')}
                className="flex-grow"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="ml-2 h-9 w-9 shrink-0 px-0"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={condition.value2 ? new Date(condition.value2) : undefined}
                    onSelect={(date) => updateCondition("value2", date ? format(date, "yyyy-MM-dd") : "")}
                    initialFocus
                    fromYear={1900}
                    toYear={2100}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        );
      }

      return (
        <div className="ml-2 flex items-center flex-grow">
          <Input
            placeholder="YYYY-MM-DD"
            value={condition.value || ""}
            onChange={(e) => handleDateInputChange(e, 'value')}
            className="flex-grow"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="ml-2 h-9 w-9 shrink-0 px-0"
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card" align="start">
              <Calendar
                mode="single"
                selected={condition.value ? new Date(condition.value) : undefined}
                onSelect={(date) => updateCondition("value", date ? format(date, "yyyy-MM-dd") : "")}
                initialFocus
                fromYear={1900}
                toYear={2100}
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    }

    // Default Text Input
    return (
      <>
        <Input
          placeholder="Value"
          value={condition.value || ""}
          onChange={(e) => updateCondition("value", e.target.value)}
          className="ml-2 flex-grow"
        />
        {operator === "between" && (
          <>
            <span className="mx-2 text-sm">và</span>
            <Input
              placeholder="End value"
              value={condition.value2 || ""}
              onChange={(e) => updateCondition("value2", e.target.value)}
              className="flex-grow"
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="mb-2 flex items-center rounded border border-gray-300 p-3">
      <GripVertical className="mr-2 text-gray-400 cursor-grab" size={20} />

      {/* Field select */}
      <Select
        value={condition?.field}
        onValueChange={(newValue) => updateCondition("field", newValue)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select field">
            {condition.field ? attributes.find((attr) => attr.name === condition.field)?.name || "Select field"
              : "no attribute"}
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
              Không có thuộc tính khả dụng
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* Operator select */}
      <Select
        value={condition.operator || undefined}
        onValueChange={(newValue) => updateCondition("operator", newValue)}
        disabled={!condition.field}
      >
        <SelectTrigger className="w-[140px] ml-2">
          <SelectValue placeholder="Chọn toán tử" />
        </SelectTrigger>
        <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value} className="hover:bg-background hover:rounded-md cursor-pointer">
              {translateLabelToVietnamese(op.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value input */}
      {condition.operator && renderValueInput()}

      {/* Delete button */}
      <Button variant="ghost" size="icon" className="ml-2" onClick={removeCondition}>
        <Trash className="w-4 h-4" color={'#E11D48'} />
      </Button>
    </div>
  );
};

export default AttributeCondition;
