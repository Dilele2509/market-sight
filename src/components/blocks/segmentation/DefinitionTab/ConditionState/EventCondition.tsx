import { CalendarDays, Trash, Link, Group } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EVENT_CONDITION_TYPES, FREQUENCY_OPTIONS, OPERATORS, TIME_PERIOD_OPTIONS } from "@/types/constant";
import { defineDatasetName, useSegmentData } from "@/context/SegmentDataContext";
import { useEffect, useState } from "react";
import RelatedDatasetCondition from "./RelatedDatasetCondition";
import { ReactSortable } from "react-sortablejs";
import { useSegmentToggle } from "@/context/SegmentToggleContext";

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
  const { datasets, selectedDataset, setRelatedConditions, relatedConditions, relatedDatasetNames } = useSegmentData()
  const { isDisableRelatedAdd, setIsDisableRelatedAdd } = useSegmentToggle();
  useEffect(() => {
    updateCondition('columnKey', datasets['Transactions'].fields[0])
  })

  useEffect(() => {
    updateCondition('relatedConditions', relatedConditions);
  }, [relatedConditions])


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
      fields: relatedFields,
      operator: 'AND',
      relatedAttributeConditions: [{
        id: 1,
        field: relatedFields[0],
        operator: '',
        value: '',
        value2: '',
      }]
    };

    // Cập nhật relatedConditions
    setRelatedConditions([...existingRelated, newCondition]);

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

  const renderRelatedDatasetCondition = (relatedCondition: any) => {
    return (
      <RelatedDatasetCondition
        condition={relatedCondition}
      />
    );
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

  return (
    <>
      <div className="relative">
        {relatedConditions.length > 0 && (<div className={`border-2 ${condition.operator === "AND" ? 'border-primary-dark' : 'border-red-400'} pl-2 w-6 border-l-0 rounded-xl rounded-l-none top-1/4 bottom-[20%] -right-6 absolute transition-colors duration-300`}>
          <Select
            value={condition.operator}
            onValueChange={handleRootOperatorChange}
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
                <Input type="number" className="w-14" min={1} value={condition.count || 1} onChange={(e) => updateCondition("count", Number(e.target.value))} />
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

          {/* Add buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
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

        <ReactSortable list={relatedConditions} setList={setRelatedConditions} animation={200} className="space-y-2">
          {relatedConditions && relatedConditions.map((related: any) => {
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