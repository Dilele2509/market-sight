
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface Message {
  type: "user" | "ai";
  content: string;
}

export default function Segmentation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "ai" as const,
      content: "Hello! I'm your AI assistant. I can help you create customer segments based on your data. How would you like to segment your customers?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { type: "user" as const, content: inputMessage },
      { type: "ai" as const, content: "I understand you want to create a segment. Could you provide more details about the criteria you'd like to use?" },
    ];
    setMessages(newMessages);
    setInputMessage("");
  };

  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-2rem)] gap-4">
        {/* Chat Interface */}
        <div className="w-1/2 flex flex-col bg-card rounded-lg border p-4">
          <h2 className="text-2xl font-bold mb-4">AI Segmentation Assistant</h2>
          
          {/* Messages Area */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="mt-4 flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              className="self-end"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <Card className="w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">Segment Preview</h2>
          <div className="h-full flex items-center justify-center text-muted-foreground">
            {previewData ? (
              <pre>{JSON.stringify(previewData, null, 2)}</pre>
            ) : (
              <p>Your segment preview will appear here</p>
            )}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
