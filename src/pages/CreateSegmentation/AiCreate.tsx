"use client"

import { useContext, useEffect, useState } from "react"
import { ChatInterface } from "@/components/blocks/AIChat/chat-interface"
import { PreviewPanel } from "@/components/blocks/AIChat/preview-panel"
import type { ChatMessage, HistoryResult, ResponseData } from "@/types/aichat"
import { generateSQLPreview } from "@/utils/segmentFunctionHelper"
import { useSegmentData } from "@/context/SegmentDataContext"
import { useAiChatContext } from "@/context/AiChatContext"
import AuthContext from "@/context/AuthContext"
import { toast } from "sonner"
import { axiosPrivate } from "@/API/axios"

export default function AiCreate() {
    // State for chat history
    // const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    //     {
    //         user: "",
    //         ai: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn tạo phân khúc khách hàng dựa trên dữ liệu của bạn. Bạn muốn phân khúc khách hàng như thế nào?",
    //     },
    // ])

    const [activeTab, setActiveTab] = useState("sql")
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useContext(AuthContext);
    const { selectedDataset, setSqlQuery, setConditionGroups, setConditions, setRootOperator, setResponseData, responseData, setInputMessage, chatHistory, setChatHistory, setHistoryResult } = useAiChatContext()

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        const newMessage: ChatMessage = { user: message };
        setChatHistory(prev => [...prev, newMessage]);

        setIsLoading(true);

        try {
            console.log('check input message: ', message);
            const res = await axiosPrivate.post('/segment/nlp/chatbot', { nlpQuery: message }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            //console.log("check res: ", res.data);
            if (res.status === 200 && res.data?.success) {
                const dataRes: ResponseData = res.data;
                console.log('check dataRes: ', dataRes);
                // Update response data
                setResponseData(dataRes);

                const filter = dataRes?.data?.filter_criteria;
                if (filter) {
                    const aiResponse = `🎯 Tôi đã tạo phân khúc dựa trên tiêu chí bạn cung cấp:\n${dataRes?.data?.explanation?.key_conditions.map(item => `• ${item}`).join("\n")}\n\n📊 Bạn có thể xem kết quả trong tab "Xem trước" cho yêu cầu: "${message}"`;

                    setChatHistory((prev) => {
                        const updated = [...prev]
                        updated[updated.length - 1] = { ...updated[updated.length - 1], ai: aiResponse }
                        return updated
                    })
                    setHistoryResult((prev) => {
                        const createVersion = [...prev];
                        const newEntry: HistoryResult = {
                            version: `version ${createVersion.length + 1}`,
                            result: dataRes as ResponseData,
                        };
                        return [...createVersion, newEntry];
                    });
                    toast.success('AI response success');
                }
            } else {
                const aiResponse = `Xin lỗi chúng tôi ${res.data?.error && res.data.error.charAt(0).toUpperCase() + res.data.error.slice(1)}`
                setChatHistory((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = { ...updated[updated.length - 1], ai: aiResponse }
                    return updated
                })
            }
        } catch (err: any) {
            const message = err?.message || 'Không xác định được lỗi';
            toast.error(`Có lỗi xảy ra với AI: ${message}`);
        } finally {
            setIsLoading(false);
            setInputMessage("")
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] gap-2 bg-background from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <ChatInterface chatHistory={chatHistory} isLoading={isLoading} onSendMessage={handleSendMessage} />
            <PreviewPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isLoading={isLoading}
                responseData={responseData}
            />
        </div>
    )
}
