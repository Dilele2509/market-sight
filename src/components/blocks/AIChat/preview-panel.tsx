"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, Code, Database } from "lucide-react"
import { SqlEditor } from "./sql-editor"
import { ModelEditor } from "./model-editor"
import { LoadingCircles } from "./loading-circles"
import { DataTable } from "./data-table"
import { ResponseData } from "@/types/aichat"

interface PreviewPanelProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    isLoading: boolean
    responseData: ResponseData
}

export function PreviewPanel({
    activeTab,
    setActiveTab,
    isLoading,
    responseData,
}: PreviewPanelProps) {
    return (
        <Card className="w-full md:w-[60%] flex flex-col overflow-hidden shadow-lg">
            <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                <CardHeader className="px-4 py-3 border-b bg-card">
                    <TabsList className="grid grid-cols-3 h-10 rounded-lg">
                        <TabsTrigger value="preview" className="rounded-md">
                            <div className="flex items-center gap-2 py-0.5">
                                <Table className="h-4 w-4" />
                                <span className="text-sm font-medium">Xem trước</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger disabled={isLoading} value="sql" className="rounded-md">
                            <div className="flex items-center gap-2 py-0.5">
                                <Code className="h-4 w-4" />
                                <span className="text-sm font-medium">Chỉnh sửa SQL</span>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger disabled={isLoading} value="model" className="rounded-md">
                            <div className="flex items-center gap-2 py-0.5">
                                <Database className="h-4 w-4" />
                                <span className="text-sm font-medium">Chỉnh sửa mô hình</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </CardHeader>

                <CardContent className="p-0 flex-1 overflow-hidden">
                    <TabsContent
                        value="preview"
                        className="flex-1 overflow-auto p-5 m-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
                    >
                        <CardTitle className="text-lg font-semibold mb-4">Xem trước dữ liệu</CardTitle>
                        {isLoading ? (
                            <div className="h-[calc(100%-2rem)] flex flex-col items-center justify-center">
                                <LoadingCircles />
                                <p className="mt-5 text-sm font-medium">Đang tạo dữ liệu phân khúc...</p>
                                <p className="text-xs text-muted-foreground mt-1">Quá trình này có thể mất vài giây</p>
                            </div>
                        ) : responseData ? (
                            <DataTable />
                        ) : (
                            <div className="h-[calc(100%-2rem)] flex flex-col items-center justify-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed p-8">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                    <Table className="h-8 w-8 text-muted-foreground/70" />
                                </div>
                                <p className="text-center font-medium">Không có dữ liệu</p>
                                <p className="text-center text-sm mt-1">Gửi truy vấn để tạo dữ liệu phân khúc</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent
                        value="sql"
                        className="flex-1 p-5 m-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
                    >
                        <CardTitle className="text-lg font-semibold mb-4">Trình soạn thảo SQL</CardTitle>
                        <SqlEditor />
                    </TabsContent>

                    <TabsContent
                        value="model"
                        className="flex-1 p-5 m-0 h-full data-[state=active]:flex data-[state=active]:flex-col"
                    >
                        <CardTitle className="text-lg font-semibold mb-4">Trình soạn thảo mô hình</CardTitle>
                        <ModelEditor responseData={responseData} />
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    )
}
