import { CalendarDays, Trash, Link, Group, GripVertical, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EVENT_CONDITION_TYPES, FREQUENCY_OPTIONS, OPERATORS, TIME_PERIOD_OPTIONS } from "@/types/constant";
import { useSegmentData } from "@/context/SegmentDataContext";
import { useEffect, useState } from "react";
import RelatedDatasetCondition from "./RelatedDatasetCondition";
import { ReactSortable } from "react-sortablejs";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { defineDatasetName } from "@/utils/segmentFunctionHelper";
import { toast } from "sonner";

type AttributeCondition = {
  id: number,
  field: string,
  operator: string,
  value: string,
  value2: string
}

type EventConditionProps = {
  condition: {
    id: number;
    type: string;
    columnKey: string,
    relatedColKey: string,
    eventType: string;
    frequency?: string;
    count?: number;
    timeValue?: number;
    timePeriod?: string;
    operator?: 'AND' | 'OR';
    attributeConditions: AttributeCondition[];
    relatedConditions: any;
  };
  isInGroup?: boolean;
  groupId?: string | null;
  handleUpdateCondition: (id: number, field: string, value: any) => void;
  handleRemoveCondition: (id: number) => void;
  handleUpdateGroupCondition?: (groupId: any | null, id: any, field: string, value: any) => void;
  handleRemoveGroupCondition?: (groupId: any | null, id: any) => void;
};

const EventCondition: React.FC<EventConditionProps> = ({
  condition,
  isInGroup = false,
  groupId = null,
  handleUpdateCondition,
  handleRemoveCondition,
  handleUpdateGroupCondition,
  handleRemoveGroupCondition,
}) => {
  const { datasets, selectedDataset, relatedDatasetNames, setConditions } = useSegmentData()
  const { isDisableRelatedAdd, setIsDisableRelatedAdd } = useSegmentToggle();
  const [relatedConditionsState, setRelatedConditionsState] = useState([])
  const [attributes, setAttributes] = useState<any[]>([]);

  const attribute = attributes.find((attr) => attr.name === datasets['Transactions'].fields[0]);
  const attributeType = attribute ? attribute.type : "text";
  const operators = OPERATORS[attributeType] || OPERATORS.text;

  useEffect(() => {
    updateCondition('relatedConditions', relatedConditionsState);
  }, [relatedConditionsState])

  useEffect(() => {
    console.log(condition);
  })
  useEffect(() => {
    fetchAttributes({
      name: 'Transactions',
      fields: datasets['Transactions'].fields,
    });
  }, [datasets]);

  const fetchAttributes = async (dataset: any, showToast = true) => {
    try {
      if (!dataset) {
        if (showToast) {
          toast.error(`Table information for ${dataset?.name} not found`);
        }
        return;
      }

      if (dataset.fields && Array.isArray(dataset.fields) && dataset.fields.length > 0) {
        const formattedAttributes = dataset.fields.map((field) => ({
          name: field,
          type: determineFieldType(field),
        }));

        setAttributes(formattedAttributes);
        return;
      } else {
        toast.error("Cannot fetch attribute, please check database connection");
      }

      setAttributes(dataset.fields);
    } catch {
      toast.error("Cannot run fetch attribute function");
    }
  };

  useEffect(() => {
    console.log(condition);
  }, [])

  const determineFieldType = (fieldName: string, dataType = null) => {
    if (dataType) {
      if (dataType.includes("timestamp") || dataType.includes("date") || dataType.includes("time")) return "datetime";
      if (dataType.includes("int") || dataType.includes("float") || dataType.includes("numeric") || dataType.includes("decimal") || dataType.includes("double")) return "number";
      if (dataType === "boolean") return "boolean";
      if (dataType.includes("array") || dataType.includes("json") || dataType.includes("jsonb")) return "array";
      return "text";
    }

    const lowerField = fieldName.toLowerCase();
    if (lowerField.includes("date") || lowerField.includes("time") || lowerField.includes("_at")) return "datetime";
    if (["id", "amount", "price", "cost", "quantity", "number"].some((keyword) => lowerField.includes(keyword))) return "number";
    if (["is_", "has_"].some((prefix) => lowerField.includes(prefix))) return "boolean";
    if (["tags", "categories", "array"].some((val) => lowerField.includes(val))) return "array";
    return "text";
  };

  const handleAddRelatedCondition = (type: string) => {
    const existingRelated = condition.relatedConditions || [];
    const usedDatasets = existingRelated.map((c: any) => c.relatedDataset);

    // Tìm dataset đầu tiên hợp lệ (không là 'customers' và chưa dùng)
    const firstValidData = relatedDatasetNames.find(
      (data) => data.trim() !== 'customers' && !usedDatasets.includes(data)
    );

    if (!firstValidData) {
      return;
    }

    const relatedFields = [...datasets[defineDatasetName(firstValidData)].fields];
    const newId = Math.max(0, ...existingRelated.map((c: any) => c.id)) + 1;

    const newCondition = {
      id: newId,
      type: type || 'related',
      relatedDataset: firstValidData,
      joinWithKey: relatedFields[0],
      fields: relatedFields,
      operator: 'AND',
      relatedAttributeConditions: []
    };

    // Cập nhật relatedConditions
    setRelatedConditionsState([...existingRelated, newCondition]);

    // Kiểm tra nếu sau khi thêm thì không còn dataset hợp lệ nữa -> disable nút
    const nextUsedDatasets = [...usedDatasets, firstValidData];
    const stillAvailable = relatedDatasetNames.some(
      (data) =>
        data.trim() !== 'customers' && !nextUsedDatasets.includes(data)
    );

    if (!stillAvailable) {
      setIsDisableRelatedAdd(!isDisableRelatedAdd);
    }
  };

  const updateCondition = (field: string, value: any) => {
    if (isInGroup && handleUpdateGroupCondition) {
      handleUpdateGroupCondition(groupId, condition.id, field, value);
    } else {
      handleUpdateCondition(condition.id, field, value);
    }
  };
  const handleRootOperatorChange = (newValue) => {
    if (newValue !== null) {
      updateCondition('operator', newValue);
    }
  };

  const updatedAttributeCondition = (key: string, value: string, index: number) => {
    handleUpdateAttributeCondition(condition.id, key, value, index);
  };
  const handleUpdateAttributeCondition = (id, field, value, index) => {
    setConditions(prevConditions =>
      prevConditions.map(condition => {
        if (condition.id === id) {
          const updatedAttributes = [...condition.attributeConditions];
          updatedAttributes[index] = {
            ...updatedAttributes[index],
            [field]: value,
          };
          return {
            ...condition,
            attributeConditions: updatedAttributes,
          };
        }
        return condition;
      })
    );
  };

  const handleRemoveAttributeCondition = (conditionId: number, index: number) => {
    setConditions(prevConditions =>
      prevConditions.map(condition => {
        if (condition.id === conditionId) {
          const updatedAttributes = [...condition.attributeConditions];
          updatedAttributes.splice(index, 1);
          return {
            ...condition,
            attributeConditions: updatedAttributes,
          };
        }
        return condition;
      })
    );
  };

  const removeAttributeCondition = (index: number) => {
    handleRemoveAttributeCondition(condition.id, index);
  };
  const handleAddAttributeCondition = () => {
    const existingAttCon = condition.attributeConditions || [];
    const newId = Math.max(0, ...existingAttCon.map((c: any) => c.id)) + 1;

    const newCondition = {
      id: newId,
      field: '',
      operator: '',
      value: '',
      value2: ''
    };

    updateCondition('attributeConditions', [...existingAttCon, newCondition])
  }


  //rendering function
  const renderRelatedDatasetCondition = (relatedCondition: any) => {
    return (
      <RelatedDatasetCondition
        condition={relatedCondition}
        relatedConditionsState={relatedConditionsState}
        setRelatedConditionsState={setRelatedConditionsState}
      />
    );
  };

  const renderEventAttCon = (attCon: any, index: any) => {
    return (
      <Card key={index} className="flex items-center justify-between min-w-fit p-2">
        <div className="flex items-center space-x-4">
          <GripVertical className="mr-2 text-gray-400 cursor-grab" size={20} />
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center space-x-2">
              {/* Field select */}
              {datasets['Transactions'].fields[0].length > 0 && (
                <Select
                  value={attCon.field || ""}
                  onValueChange={(value) => { updatedAttributeCondition('field', value, index) }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select field">
                      {attCon.field
                        ? attributes.find((attr) => attr.name === attCon.field)?.name || "Select field"
                        : "No attribute"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    {attributes.length > 0 ? (
                      attributes.map((attr) => (
                        <SelectItem
                          key={attr.name}
                          value={attr.name}
                          className="hover:bg-background hover:rounded-md cursor-pointer"
                        >
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
                      <SelectItem
                        value="no attribute"
                        disabled
                        className="text-gray-400"
                      >
                        No attributes available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
  
              {/* Operator select */}
              <Select
                value={attCon.operator || ""}
                onValueChange={(newValue) => updatedAttributeCondition("operator", newValue, index)}
                disabled={!datasets['Transactions'].fields[0]}
              >
                <SelectTrigger className="w-[140px] ml-2">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                  {operators.map((op) => (
                    <SelectItem
                      key={op.value}
                      value={op.value}
                      className="hover:bg-background hover:rounded-md cursor-pointer"
                    >
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
  
            </div>
            <div>
              {/* Value input */}
              {attCon.operator &&
                !["is_null", "is_not_null", "is_empty", "is_not_empty"].includes(attCon.operator) && (
                  <Input
                    placeholder="Value"
                    value={attCon.value || ""}
                    onChange={(e) => updatedAttributeCondition("value", e.target.value, index)}
                    className="flex-grow"
                  />
                )}
  
              {/* Additional value input for "between" operator */}
              {attCon.operator === "between" && (
                <>
                  <span className="text-sm">And</span>
                  <Input
                    placeholder="End value"
                    value={attCon.value2 || ""}
                    onChange={(e) => updatedAttributeCondition("value2", e.target.value, index)}
                    className="flex-grow"
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="ml-2" onClick={() => removeAttributeCondition(index)}>
          <Trash className="w-4 h-4" color={"#E11D48"} />
        </Button>
      </Card>
    );
  };

  return (
    <>
      <div className="relative">
        {relatedConditionsState.length > 0 && (<div className={`border-2 ${condition.operator === "AND" ? 'border-primary-dark' : 'border-red-400'} pl-2 w-6 border-l-0 rounded-xl rounded-l-none top-1/4 bottom-[20%] -right-6 absolute transition-colors duration-300`}>
          <Select
            value={condition.operator}
            onValueChange={(newValue) => handleRootOperatorChange(newValue)}
            defaultValue="AND"
          >
            <SelectTrigger className={`absolute top-1/2 -right-6 min-w-fit transform -translate-y-1/2 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-sm border transition-colors duration-300 ${condition.operator === "AND" ? "bg-primary-dark" : "bg-red-500"}`}>
              {condition.operator}
            </SelectTrigger>
            <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
              <SelectItem value="AND" className="hover:bg-background hover:rounded-md cursor-pointer">AND</SelectItem>
              <SelectItem value="OR" className="hover:bg-background hover:rounded-md cursor-pointer">OR</SelectItem>
            </SelectContent>
          </Select>
        </div>)}
        <Card className="mb-4 bg-muted border border-border p-4">
          {/* Event Name */}
          <CardContent className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-primary" />
              <Label className="font-medium text-md min-w-fit">Retail Event</Label>
            </div>
            <Button variant="ghost" size="icon" onClick={() => (isInGroup && handleRemoveGroupCondition ? handleRemoveGroupCondition(groupId, condition.id) : handleRemoveCondition(condition.id))}>
              <Trash className="w-4 h-4" color={'#E11D48'} />
            </Button>
          </CardContent>

          {/* event related */}
          <CardContent className="flex items-center justify-between space-x-4 mb-3 w-full">
            <div className="flex items-center w-1/2">
              <p className="text-sm font-medium">Unique ID</p>
              <div className="ml-4 flex-grow">
                <Select value={condition.columnKey} onValueChange={(value) => updateCondition('columnKey', value)}>
                  <SelectTrigger className="py-2">
                    <SelectValue placeholder="Select unique ID" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    {datasets['Transactions'].fields.map((field: string) => (
                      <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center w-1/2">
              <p className="text-sm font-medium">join with</p>
              <div className="ml-4 flex-grow">
                <Select value={condition.relatedColKey} onValueChange={(value) => updateCondition('relatedColKey', value)}>
                  <SelectTrigger className="py-2">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    {selectedDataset.fields.map((field: string) => (
                      <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          {/* event case */}
          <CardContent className="flex items-center mb-3">
            <p className="text-sm font-medium">Retail case</p>
            <div className="ml-4 flex-grow">
              <Select value={condition.eventType || "performed"} onValueChange={(value) => updateCondition("eventType", value)}>
                <SelectTrigger className="py-2">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                  {EVENT_CONDITION_TYPES.map((type) => (
                    <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          {/* Occurrence Conditions */}
          {!["first_time", "last_time"].includes(condition.eventType) ? (
            <CardContent className="flex items-center flex-wrap gap-4">
              <div className="flex items-center gap-4 mb-3">
                <Label className="font-medium text-sm w-20">Occurring</Label>
                <Select value={condition.frequency || "at_least"} onValueChange={(value) => updateCondition("frequency", value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    {FREQUENCY_OPTIONS.map((option) => (
                      <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="number" className="w-14" min={0} value={condition.count || 1} onChange={(e) => updateCondition("count", Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Times</Label>
                <Select value="within last">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" value="within last">within last</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" className="w-20" min={0} value={condition.timeValue || 30} onChange={(e) => updateCondition("timeValue", Number(e.target.value))} />
                <Select value={condition.timePeriod || "days"} onValueChange={(value) => updateCondition("timePeriod", value)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    {TIME_PERIOD_OPTIONS.map((option) => (
                      <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex items-center gap-4">
              <Label className="font-medium w-20">Within</Label>
              <Select value="last">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                  <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" value="last">last</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" className="w-20" min={1} value={condition.timeValue || 30} onChange={(e) => updateCondition("timeValue", Number(e.target.value))} />
              <Select value={condition.timePeriod || "days"} onValueChange={(value) => updateCondition("timePeriod", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                  {TIME_PERIOD_OPTIONS.map((option) => (
                    <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          )}

          <CardContent className="grid grid-cols-10 gap-4">
            <Label className="text-sm font-medium col-span-1">Where</Label>
            <div className="relative col-span-9">
              {condition.attributeConditions.length > 1 && (<div className={`border-2 ${condition.operator === "AND" ? 'border-primary' : 'border-yellow-400'} pl-2 w-6 border-l-0 rounded-xl rounded-l-none top-1/4 bottom-[20%] -right-6 absolute transition-colors duration-300`}>
                <Select
                  value={condition.operator}
                  onValueChange={handleRootOperatorChange}
                  defaultValue="AND"
                >
                  <SelectTrigger className={`absolute top-1/2 -right-6 min-w-fit transform -translate-y-1/2 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-sm border transition-colors duration-300 ${condition.operator === "AND" ? "bg-primary" : "bg-yellow-500"}`}>
                    {condition.operator}
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    <SelectItem value="AND" className="hover:bg-background hover:rounded-md cursor-pointer">AND</SelectItem>
                    <SelectItem value="OR" className="hover:bg-background hover:rounded-md cursor-pointer">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>)}
              {condition.attributeConditions.length > 0 ? (
                <ReactSortable
                  list={condition.attributeConditions}
                  setList={(newList) => updateCondition("relatedAttributeConditions", newList)}
                  animation={200}
                  className="space-y-2 w-full pl-4"
                >
                  {condition.attributeConditions.map((relatedAttCon, index) => (renderEventAttCon(relatedAttCon, index)))}
                </ReactSortable>) :
                (
                  <Card className="flex items-center justify-center p-2">
                    <p className="text-sm">No related attribute condition</p>
                  </Card>
                )}
            </div>
          </CardContent>

          {/* Add buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="px-2 py-1 text-xs w-auto"
              onClick={handleAddAttributeCondition}
            >
              <SlidersHorizontal className="w-3 h-3 mr-1" /> Add event attribute condition
            </Button>
            <Button
              variant="outline"
              disabled={!relatedDatasetNames || isDisableRelatedAdd}
              size="sm"
              className="px-2 py-1 text-xs w-auto"
              onClick={() => handleAddRelatedCondition('related')}
            >
              <Link className="w-3 h-3 mr-1" /> Add related condition
            </Button>
          </div>
        </Card >

        <ReactSortable list={relatedConditionsState} setList={setRelatedConditionsState} animation={200} className="space-y-2">
          {relatedConditionsState && relatedConditionsState.map((related: any) => {
            if (related.type === 'related') return (
              <Card key={related.id} className="mb-4 bg-muted border border-border p-4">
                {renderRelatedDatasetCondition(related)}
              </Card>
            )
          })}
        </ReactSortable>
      </div>
    </>
  );
};

export default EventCondition;