"use client"

import { useContext, useEffect, useState } from "react"
import { ChatInterface } from "@/components/blocks/AIChat/chat-interface"
import { PreviewPanel } from "@/components/blocks/AIChat/preview-panel"
import type { ChatMessage, ResponseData } from "@/types/aichat"
import { generateSQLPreview } from "@/utils/segmentFunctionHelper"
import { useSegmentData } from "@/context/SegmentDataContext"
import { useAiChatContext } from "@/context/AiChatContext"
import AuthContext from "@/context/AuthContext"
import { toast } from "sonner"
import { axiosPrivate } from "@/API/axios"

export default function AiCreate() {
    // State for chat history
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        {
            user: "",
            ai: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn tạo phân khúc khách hàng dựa trên dữ liệu của bạn. Bạn muốn phân khúc khách hàng như thế nào?",
        },
    ])

    const [activeTab, setActiveTab] = useState("preview")
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useContext(AuthContext);
    const { selectedDataset, setSqlQuery, setConditionGroups, setConditions, setRootOperator, setResponseData, responseData, setInputMessage } = useAiChatContext()

    useEffect(() => {
        const reshuhu: ResponseData = {
            "success": true,
            "data": {
                "query": "lấy cho tôi các khách hàng là nữ, có mua hàng tại cửa hàng mega mart hoặc city mart trong vòng 1 tháng và mua tổng giá trị trên 50 cho mặt hàng thời trang",
                "explanation": {
                    "query_intent": "Tìm khách hàng nữ đã mua hàng tại cửa hàng Mega Mart hoặc City Mart trong vòng 1 tháng qua với tổng giá trị trên 50 đơn vị tiền tệ cho mặt hàng thời trang",
                    "key_conditions": [
                        "Khách hàng là nữ (gender = 'F')",
                        "Mua hàng tại cửa hàng Mega Mart HOẶC City Mart",
                        "Thời gian giao dịch trong vòng 1 tháng gần đây",
                        "Tổng giá trị giao dịch lớn hơn 50",
                        "Mặt hàng thuộc danh mục thời trang"
                    ]
                },
                "filter_criteria": {
                    "conditions": [
                        {
                            "id": 1,
                            "type": "attribute",
                            "field": "gender",
                            "operator": "equals",
                            "value": "F",
                            "value2": "",
                            "chosen": false,
                            "selected": false
                        },
                        {
                            "id": 2,
                            "type": "event",
                            "columnKey": "customer_id",
                            "relatedColKey": "customer_id",
                            "eventType": "performed",
                            "frequency": "at_least",
                            "count": 1,
                            "timePeriod": "months",
                            "timeValue": 1,
                            "operator": "AND",
                            "attributeOperator": "AND",
                            "attributeConditions": [
                                {
                                    "id": 3,
                                    "field": "total_amount",
                                    "operator": "greater_than",
                                    "value": "50",
                                    "value2": "",
                                    "chosen": false,
                                    "selected": false
                                }
                            ],
                            "relatedConditions": [
                                {
                                    "id": 4,
                                    "type": "related",
                                    "relatedDataset": "stores",
                                    "joinWithKey": "store_id",
                                    "fields": [
                                        "store_id",
                                        "store_name",
                                        "address",
                                        "city",
                                        "store_type",
                                        "opening_date",
                                        "region"
                                    ],
                                    "operator": "OR",
                                    "relatedAttributeConditions": [
                                        {
                                            "id": 5,
                                            "field": "store_name",
                                            "operator": "equals",
                                            "value": "Mega Mart",
                                            "value2": "",
                                            "chosen": false,
                                            "selected": false
                                        },
                                        {
                                            "id": 6,
                                            "field": "store_name",
                                            "operator": "equals",
                                            "value": "City Mart",
                                            "value2": "",
                                            "chosen": false,
                                            "selected": false
                                        }
                                    ],
                                    "chosen": false,
                                    "selected": false
                                },
                                {
                                    "id": 7,
                                    "type": "related",
                                    "relatedDataset": "product_lines",
                                    "joinWithKey": "product_line_id",
                                    "fields": [
                                        "product_line_id",
                                        "unit_cost",
                                        "brand",
                                        "subcategory",
                                        "name",
                                        "category"
                                    ],
                                    "operator": "AND",
                                    "relatedAttributeConditions": [
                                        {
                                            "id": 8,
                                            "field": "category",
                                            "operator": "equals",
                                            "value": "Fashion",
                                            "value2": "",
                                            "chosen": false,
                                            "selected": false
                                        }
                                    ],
                                    "chosen": false,
                                    "selected": false
                                }
                            ],
                            "chosen": false,
                            "selected": false
                        }
                    ],
                    "conditionGroups": [],
                    "rootOperator": "AND"
                }
            }
        }
        console.log(reshuhu);
        setResponseData(reshuhu);
        const filter = reshuhu?.data?.filter_criteria
        if (filter) {
            setConditions(filter?.conditions || []);
            setConditionGroups(filter?.conditionGroups || []);
            setRootOperator(filter?.rootOperator || "AND");
            setSqlQuery(generateSQLPreview(selectedDataset, filter?.conditions, filter?.conditionGroups, filter?.rootOperator))
        }
    }, [])

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
                    setConditions(filter.conditions || []);
                    setConditionGroups(filter.conditionGroups || []);
                    setRootOperator(filter.rootOperator || "AND");
                    setSqlQuery(generateSQLPreview(selectedDataset, filter.conditions, filter.conditionGroups, filter.rootOperator))
                }

                toast.success('AI response success');
                const aiResponse = `Tôi đã tạo phân khúc dựa trên tiêu chí của bạn:

${dataRes?.data?.explanation?.key_conditions.map(item => `- ${item}`).join("\n")}

Bạn có thể xem kết quả trong tab Xem trước cho yêu cầu: ${message}`;

                setChatHistory((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = { ...updated[updated.length - 1], ai: aiResponse }
                    return updated
                })
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
