"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import type { ChatMessage } from "@/types/aichat"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { useAiChatContext } from "@/context/AiChatContext"

interface ChatInterfaceProps {
    chatHistory: ChatMessage[]
    isLoading: boolean
    onSendMessage: (message: string) => void
}

export function ChatInterface({ chatHistory, isLoading, onSendMessage }: ChatInterfaceProps) {
    const { inputMessage, setInputMessage } = useAiChatContext()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatHistory])

    const handleSendMessage = () => {
        if (!inputMessage.trim() || isLoading) return
        onSendMessage(inputMessage)
        setInputMessage("")
    }

    return (
        <Card className="md:w-[40%] flex flex-col overflow-hidden shadow-lg">
            <CardHeader className="px-4 py-3 border-b bg-card">
                <CardTitle className="text-lg font-semibold">Trợ lý phân khúc AI</CardTitle>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-hidden">
                <MessageList messages={chatHistory} isLoading={isLoading} messagesEndRef={messagesEndRef} />
            </CardContent>

            <CardFooter className="p-3 border-t bg-card">
                <MessageInput
                    value={inputMessage}
                    onChange={setInputMessage}
                    onSend={handleSendMessage}
                    isLoading={isLoading}
                />
            </CardFooter>
        </Card>
    )
}
