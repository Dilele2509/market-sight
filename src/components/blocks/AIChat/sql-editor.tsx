"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Play, Terminal, XCircle, Copy, Check, Download, Maximize2, Minimize2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAiChatContext } from "@/context/AiChatContext"
import { convertSQLToSegment } from "@/utils/segmentFunctionConvert"

interface SqlEditorProps {
}

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })

export function SqlEditor({ }: SqlEditorProps) {
    const [result, setResult] = useState<string | null>(null)
    const [isExecuting, setIsExecuting] = useState(false)
    const [activeTab, setActiveTab] = useState("editor")
    const [copied, setCopied] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [typedQuery, setTypedQuery] = useState("")
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const { sqlQuery, setSqlQuery, setConditions, setConditionGroups, setRootOperator } = useAiChatContext()

    useEffect(() => {
        window.MonacoEnvironment = {
            getWorkerUrl: function (moduleId, label) {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                    baseUrl: '/',
                };
                importScripts('https://unpkg.com/monaco-editor@0.45.0/min/vs/base/worker/workerMain.js');
            `)}`;
            }
        };
    }, []);


    useEffect(() => {
        if (!sqlQuery) {
            setTypedQuery("")
            return
        }

        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
        }

        let index = 0
        setTypedQuery("")
        typingIntervalRef.current = setInterval(() => {
            setTypedQuery((prev) => {
                const next = prev + sqlQuery[index]
                index++
                if (index >= sqlQuery.length) {
                    clearInterval(typingIntervalRef.current!)
                    typingIntervalRef.current = null
                }
                return next
            })
        }, 5)
    }, [])

    const handleClearResult = () => {
        setResult(null)
        setActiveTab("editor")
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(sqlQuery)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([sqlQuery], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "query.sql"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    const handleSqlChange = (v: string | null) => {
        setSqlQuery(v ?? "");
        const sqlQuery = v.trim();
        try {
            console.log(convertSQLToSegment(sqlQuery))
            setConditions(convertSQLToSegment(sqlQuery).conditions)
            setConditionGroups(convertSQLToSegment(sqlQuery).groupConditions)
            setRootOperator(convertSQLToSegment(sqlQuery).rootOperator)
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className={`flex flex-col transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 p-4 bg-background" : "h-full"}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <div className="flex items-center justify-between mb-3">
                    <TabsList className="h-9">
                        <TabsTrigger value="editor" className="flex items-center gap-1.5 px-3">
                            <Terminal className="h-4 w-4" />
                            <span>Editor</span>
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex gap-1.5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{copied ? "Đã sao chép" : "Sao chép"}</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Tải xuống</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}</p>
                                </TooltipContent>
                            </Tooltip>

                            {result && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={handleClearResult}>
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Xóa kết quả</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </TooltipProvider>
                    </div>
                </div>
                <TabsContent value="editor" className="m-0 h-[92%]">
                    <div className="h-full py-4 bg-[#1e1e1e] rounded-lg overflow-hidden">
                        <MonacoEditor
                            height="100%"
                            defaultLanguage="sql"
                            value={typedQuery}
                            onChange={handleSqlChange}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                wordWrap: "on",
                                readOnly: isExecuting || !!result
                            }}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}