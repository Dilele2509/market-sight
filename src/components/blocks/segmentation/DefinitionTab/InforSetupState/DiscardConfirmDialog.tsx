import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSegmentData } from "@/context/SegmentDataContext";
import { useSegmentToggle } from "@/context/SegmentToggleContext";

// Interface cho điều kiện trong segmentation
interface Condition {
    id: string;
    type: string;
    field: string;
    operator: string;
    value?: string;
    value2?: string;
}

// Interface cho nhóm điều kiện
interface ConditionGroup {
    id: string;
    conditions: Condition[];
    operator: string;
}

// Props cho component DiscardConfirmDialog
interface DiscardConfirmDialogProps {
    discardConfirmOpen: boolean;
    setDiscardConfirmOpen: (value: boolean) => void;
    setConditions: (conditions: Condition[]) => void;
    setConditionGroups: (groups: ConditionGroup[]) => void;
    setRootOperator: (operator: string) => void;
    setSegmentName: (name: string) => void;
    setDescription: (description: string) => void;
    setShowDescriptionField: (show: boolean) => void;
    setHasUnsavedChanges: (hasChanges: boolean) => void;
    initialConditions: Condition[];
    initialConditionGroups: ConditionGroup[];
    initialRootOperator: string;
    initialSegmentName: string;
    initialDescription: string;
}

const DiscardConfirmDialog = () => {
    const {setConditions, setConditionGroups, initialConditions, initialConditionGroups, initialRootOperator, initialSegmentName, initialDescription, setRootOperator, setSegmentName, setDescription} = useSegmentData();
    const {setShowDescriptionField, setHasUnsavedChanges, setDiscardConfirmOpen, discardConfirmOpen} = useSegmentToggle();

    const confirmDiscardChanges = () => {
        // Reset tất cả các điều kiện về trạng thái ban đầu
        setConditions([...initialConditions]);
        setConditionGroups([...initialConditionGroups]);
        setRootOperator(initialRootOperator);
        setSegmentName(initialSegmentName);
        setDescription(initialDescription);

        // Nếu mô tả ban đầu trống, ẩn trường mô tả
        if (!initialDescription) {
            setShowDescriptionField(false);
        }

        setHasUnsavedChanges(false);
        setDiscardConfirmOpen(false);

        toast.info("Changes have been discarded");
    };

    const cancelDiscardChanges = () => {
        setDiscardConfirmOpen(false);
    };

    return (
        <Dialog open={discardConfirmOpen} onOpenChange={cancelDiscardChanges}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Discard Changes?</DialogTitle>
                    <DialogDescription>
                        You have unsaved changes. Are you sure you want to discard all changes?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={cancelDiscardChanges} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={confirmDiscardChanges} variant="destructive">
                        Discard Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DiscardConfirmDialog;
