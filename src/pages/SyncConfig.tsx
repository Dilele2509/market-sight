"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { InfoIcon, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useSyncContext } from "@/context/SyncContext"
import { DashboardShell } from "@/components/layout/DashboardShell"

export default function SyncConfigPage() {
    const [step, setStep] = useState<number>(1)
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const { sheetURL, setSheetURL } = useSyncContext()
    const [showPreview, setShowPreview] = useState<boolean>(false)
    const [embedUrl, setEmbedUrl] = useState<string>("")

    const handleInitialize = () => {
        // In a real app, this would call an API to initialize access rights
        setTimeout(() => {
            setShowDialog(true)
        }, 500)
    }

    useEffect(() => {
        if (sheetURL !== '') {
            setStep(2)
        }
    })

    const handleAllowAccess = () => {
        // In a real app, this would handle OAuth or permission granting
        setShowDialog(false)
        setStep(2)
    }

    const handleImportSheet = () => {
        if (!sheetURL) return

        if (!sheetURL.includes("docs.google.com/spreadsheets")) {
            alert("Please enter a valid Google Sheets URL")
            return
        }

        let url = sheetURL

        if (url.includes("/edit")) {
            url = url.replace("/edit", "/preview")

            if (url.includes("?")) {
                url = url + "&embedded=true"
            } else {
                url = url + "?embedded=true"
            }
        } else if (!url.includes("embedded=true")) {
            if (url.includes("?")) {
                url = url + "&embedded=true"
            } else {
                url = url + "?embedded=true"
            }
        }
        const storedURL = localStorage.getItem('sheetURL');
        if (storedURL !== url) {
            setSheetURL(url);
            localStorage.setItem('sheetURL', url);
        }
        setEmbedUrl(url)
        setShowPreview(true)
    }

    return (
        <DashboardShell>
            <div className="container py-10">
                <h1 className="text-3xl font-bold mb-6">Data Synchronization Configuration</h1>

                {step === 1 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 1: Initialize Access Rights</CardTitle>
                            <CardDescription>
                                Before you can synchronize data, we need to initialize access rights to your Google account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>Important</AlertTitle>
                                <AlertDescription>
                                    Click the button below to start the initialization process. This is required before you can import your
                                    Google Sheets.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleInitialize}>Initialize Access Rights</Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 2: Import Google Sheet</CardTitle>
                            <CardDescription>
                                Enter the link to your Google Sheet. Make sure you have opened editing rights on the sheet before
                                importing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Before you proceed</AlertTitle>
                                <AlertDescription>
                                    Please ensure you have set the appropriate sharing permissions on your Google Sheet. The sheet should be
                                    set to &quot;Anyone with the link can view&quot; or &quot;Anyone with the link can edit&quot; for best
                                    results.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <label htmlFor="sheet-link" className="text-sm font-medium">
                                    Google Sheet Link
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        id="sheet-link"
                                        placeholder="https://docs.google.com/spreadsheets/d/..."
                                        value={sheetURL}
                                        onChange={(e) => {
                                            console.log("Updating sheet URL to:", e.target.value)
                                            setSheetURL(e.target.value)
                                        }}
                                    />
                                    <Button onClick={handleImportSheet}>Import</Button>
                                </div>
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">Current URL in context: {sheetURL || "No URL set"}</p>
                                </div>
                            </div>

                            {showPreview && (
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">Sheet successfully connected!</span>
                                    </div>

                                    <div className="border rounded-md p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-medium">Google Sheet</h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1"
                                                onClick={() => window.open(sheetURL, "_blank")}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                <span>Open in Google Sheets</span>
                                            </Button>
                                        </div>

                                        <div className="border rounded overflow-hidden">
                                            {embedUrl ? (
                                                <iframe src={embedUrl} className="w-full h-[500px]" title="Google Sheet" frameBorder="0" />
                                            ) : (
                                                <div className="h-[500px] flex items-center justify-center bg-slate-50">
                                                    <p className="text-slate-500">Unable to load sheet preview</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Access Rights Dialog */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Initialization Successful</DialogTitle>
                            <DialogDescription>
                                The initialization was successful. Now we need your permission to access your Google Drive.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <Alert className="mb-4">
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>Important Note</AlertTitle>
                                <AlertDescription>
                                    Clicking the button below will allow the application to access Google Drive according to your login
                                    email. This is necessary to initialize and synchronize with your spreadsheets.
                                </AlertDescription>
                            </Alert>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleAllowAccess}>Allow Access Rights</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardShell>
    )
}
