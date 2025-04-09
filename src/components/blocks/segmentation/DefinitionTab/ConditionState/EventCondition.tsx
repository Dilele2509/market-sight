import { CalendarDays, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EVENT_CONDITION_TYPES, FREQUENCY_OPTIONS, TIME_PERIOD_OPTIONS } from "@/types/constant";

type EventConditionProps = {
  condition: {
    id: string;
    eventType: string;
    eventName?: string;
    frequency?: string;
    count?: number;
    timeValue?: number;
    timePeriod?: string;
  };
  isInGroup?: boolean;
  groupId?: string | null;
  handleUpdateCondition: (id: string, field: string, value: any) => void;
  handleRemoveCondition: (id: string) => void;
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
  const updateCondition = (field: string, value: any) => {
    if (isInGroup && handleUpdateGroupCondition) {
      handleUpdateGroupCondition(groupId, condition.id, field, value);
    } else {
      handleUpdateCondition(condition.id, field, value);
    }
  };

  return (
    <Card className="mb-4 bg-muted border border-border p-4">
      <CardContent className="flex items-center mb-3">
        <CalendarDays className="w-5 h-5 mr-2 text-primary" />
        <p className="text-sm font-medium">
          {EVENT_CONDITION_TYPES.find((t) => t.value === condition.eventType)?.label || "Performed"}
        </p>
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
        <Button variant="ghost" size="icon" onClick={() => (isInGroup && handleRemoveGroupCondition ? handleRemoveGroupCondition(groupId, condition.id) : handleRemoveCondition(condition.id))}>
          <Trash className="w-4 h-4" />
        </Button>
      </CardContent>

      {/* Event Name */}
      <CardContent className="flex items-center mb-3">
        <Label className="font-medium text-sm w-20">with</Label>
        <Select>
          <SelectTrigger className="w-48 py-2">
            <SelectValue placeholder="Event named" />
          </SelectTrigger>
          <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
            <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" value="Event named">Event named</SelectItem>
          </SelectContent>
        </Select>
        <Input className="flex-grow ml-4" placeholder="Event name" value={condition.eventName || ""} onChange={(e) => updateCondition("eventName", e.target.value)} />
      </CardContent>

      {/* Occurrence Conditions */}
      {!["first_time", "last_time"].includes(condition.eventType) ? (
        <CardContent className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
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
    </Card>
  );
};

export default EventCondition;