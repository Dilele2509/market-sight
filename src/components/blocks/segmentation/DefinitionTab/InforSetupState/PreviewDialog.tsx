import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clipboard, Loader2 } from "lucide-react";

interface PreviewDialogProps {
    previewOpen: boolean;
    previewData: any[];
    previewLoading: boolean;
    columns: string[];
    formatCellValue: (value: any) => string;
    generateSQLPreview: () => string;
    handleClosePreview?: ()=>void;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
    previewOpen,
    previewData,
    previewLoading,
    columns,
    formatCellValue,
    generateSQLPreview,
    handleClosePreview
}) => {
    const handleCopySQL = () => {
        const sql = generateSQLPreview();
        navigator.clipboard.writeText(sql);
        toast.success("SQL query copied to clipboard");
        console.log("SQL Query:", sql);
    };

    return (
        <>
            <Dialog open={previewOpen} onOpenChange={handleClosePreview}>
                <DialogContent className="fixed p-4 bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
                        <DialogHeader>
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="text-lg font-semibold">Preview Results</h3>
                                <small className="text-muted-foreground">
                                    {previewData.length > 0
                                        ? `Showing ${previewData.length} records`
                                        : previewLoading
                                            ? "Loading..."
                                            : "No records found"}
                                </small>
                            </div>
                        </DialogHeader>

                        <div className="overflow-hidden p-4">
                            {previewLoading ? (
                                <div className="flex justify-center items-center h-full p-3">
                                    <Loader2 className="animate-spin" />
                                    <p className="ml-2">Loading preview data...</p>
                                </div>
                            ) : previewData.length === 0 ? (
                                <div className="flex justify-center items-center h-full p-3 text-center">
                                    <p className="text-muted-foreground">
                                        No results match your current conditions. Try adjusting your filters or check your database connection.
                                    </p>
                                </div>
                            ) : (
                                <div className="max-h-[400px] overflow-auto border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {columns.map((column) => (
                                                    <TableHead key={column}>{column}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewData.map((row, rowIndex) => (
                                                <TableRow key={row.__rowid__ || rowIndex} className="hover:bg-muted">
                                                    {columns.map((column) => (
                                                        <TableCell key={`${rowIndex}-${column}`}>{formatCellValue(row[column])}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-4 border-t">
                            <Button variant="outline" onClick={handleCopySQL}>
                                <Clipboard className="mr-2 h-4 w-4" />
                                Copy SQL
                            </Button>
                            <Button onClick={handleClosePreview}>Close</Button>
                        </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PreviewDialog;
