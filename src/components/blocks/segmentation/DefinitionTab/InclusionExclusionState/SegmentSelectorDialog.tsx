import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { useSegmentData } from "@/context/SegmentDataContext";
import { toast } from "sonner";

const SegmentSelectorDialog = () => {
    const { inclusions, exclusions, setInclusions, setExclusions, setSelectionMode, selectionMode, availableSegments} = useSegmentData();
    const { setSegmentSelectorOpen, segmentSelectorOpen } = useSegmentToggle()

    const handleIncludeSegment = (segment) => {
        // Check if segment is already included
        if (!inclusions.some(inc => inc.id === segment.id)) {
            setInclusions([...inclusions, segment]);
            toast.success(`Added "${segment.name}" to inclusions`);
        } else {
            toast.info(`"${segment.name}" is already included`);
        }
        setSegmentSelectorOpen(false);
    };

    const handleExcludeSegment = (segment) => {
        // Check if segment is already excluded
        if (!exclusions.some(exc => exc.id === segment.id)) {
            setExclusions([...exclusions, segment]);
            toast.success(`Added "${segment.name}" to exclusions`);
        } else {
            toast.info(`"${segment.name}" is already excluded`);
        }
        setSegmentSelectorOpen(false);
    };

    const handleCloseSegmentSelector = () => {
        setSegmentSelectorOpen(false);
    };

    return (
        <Dialog open={segmentSelectorOpen} onOpenChange={handleCloseSegmentSelector}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {selectionMode === "include" ? "Include Records from Segment" : "Exclude Records from Segment"}
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Select a segment to {selectionMode === "include" ? "include" : "exclude"} in your current segment definition.
                    This will {selectionMode === "include" ? "limit" : "remove"} records based on their membership in the selected segment.
                </p>

                {/* Table */}
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Segment Name</TableHead>
                                <TableHead>Resource ID</TableHead>
                                <TableHead className="text-right">Size</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availableSegments.length > 0 ? (
                                availableSegments.map((segment) => (
                                    <TableRow key={segment.id}>
                                        <TableCell>{segment.name}</TableCell>
                                        <TableCell>{segment.id}</TableCell>
                                        <TableCell className="text-right">{segment.count}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                className={`flex items-center gap-1 px-2 text-secondary-light py-1 text-sm ${selectionMode === "include"
                                                    ? "bg-primary hover:bg-blue-700"
                                                    : "bg-error hover:bg-red-900"}`}
                                                size="sm"
                                                onClick={() =>
                                                    selectionMode === "include" ? handleIncludeSegment(segment) : handleExcludeSegment(segment)
                                                }
                                            >
                                                {selectionMode === "include" ? "Include" : "Exclude"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No segments available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseSegmentSelector}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SegmentSelectorDialog;
