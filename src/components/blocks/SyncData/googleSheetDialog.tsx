"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { FileSpreadsheet, Link2, ArrowRight, ChevronLeft } from "lucide-react"
import { useSyncContext } from "@/context/SyncContext"
import { cn } from "@/lib/utils"

interface GoogleSheetDialogProps {
    open: boolean
    onClose: () => void
    onSync: (option: "create" | "use", value: string) => void
}

export const GoogleSheetDialog: React.FC<GoogleSheetDialogProps> = ({ open, onClose, onSync }) => {
    const [option, setOption] = useState<"select" | "create" | "use">("select")
    const { sheetURL } = useSyncContext()
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        if (option === "use") {
            setInputValue(sheetURL || "")
        } else {
            setInputValue("")
        }
    }, [option, sheetURL])

    const handleAccessSync = () => {
        if (!inputValue.trim()) {
            toast.error("Please enter a value")
            return
        }
        onSync(option === "create" ? "create" : "use", inputValue.trim())
        onClose()
        setOption("select")
        setInputValue("")
    }

    const handleBack = () => {
        setOption("select")
        setInputValue("")
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose()
                    setOption("select")
                    setInputValue("")
                }
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Google Sheet Sync</DialogTitle>
                    <DialogDescription>Connect your data with Google Sheets for easy management and sharing.</DialogDescription>
                </DialogHeader>

                {option === "select" ? (
                    <div className="grid gap-4 py-4">
                        <Button
                            variant="outline"
                            className="flex items-center justify-between h-20 p-4 transition-all border-2 hover:border-primary hover:bg-primary/5 group"
                            onClick={() => setOption("create")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center p-2 text-white rounded-md bg-emerald-500">
                                    <FileSpreadsheet className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium">Create new Sheet</h3>
                                    <p className="text-xs text-muted-foreground">Generate a new Google Sheet file</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>

                        <Button
                            variant="outline"
                            className="flex items-center justify-between h-20 p-4 transition-all border-2 hover:border-primary hover:bg-primary/5 group"
                            onClick={() => setOption("use")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center p-2 text-white rounded-md bg-sky-500">
                                    <Link2 className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium">Use existing Sheet</h3>
                                    <p className="text-xs text-muted-foreground">Connect to a Google Sheet you already have</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={handleBack}>
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <h3 className="text-sm font-medium">
                                {option === "create" ? "Create new Google Sheet" : "Use existing Google Sheet"}
                            </h3>
                        </div>

                        <div
                            className={cn(
                                "p-4 rounded-lg border bg-muted/30",
                                option === "create" ? "border-emerald-200" : "border-sky-200",
                            )}
                        >
                            <div className="mb-3">
                                <h4 className="text-sm font-medium">
                                    {option === "create"
                                        ? "Enter a name for your new Google Sheet"
                                        : "Enter the URL of your Google Sheet"}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {option === "create"
                                        ? "A new sheet with this name will be created in your Google Drive"
                                        : "Make sure the sheet has the correct sharing permissions"}
                                </p>
                            </div>
                            <Input
                                placeholder={option === "create" ? "My Project Data" : "https://docs.google.com/spreadsheets/d/..."}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="border-input/50 focus-visible:ring-offset-0"
                            />
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                onClick={handleAccessSync}
                                className={cn(
                                    "w-full gap-2",
                                    option === "create" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-sky-600 hover:bg-sky-700",
                                )}
                            >
                                {option === "create" ? <FileSpreadsheet className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                                Connect & Sync
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
