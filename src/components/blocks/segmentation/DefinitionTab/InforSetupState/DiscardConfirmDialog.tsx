import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSegmentData } from "@/context/SegmentDataContext";
import { useSegmentToggle } from "@/context/SegmentToggleContext";

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
