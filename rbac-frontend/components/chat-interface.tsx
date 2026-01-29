"use client"

import { useState } from "react"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
    role: "user" | "bot"
    content: string
    sources?: any[]
}

export default function ChatInterface() {
    const [query, setQuery] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hello! I am your RBAC-secured assistant. Select a department context and ask me anything." }
    ])
    const [loading, setLoading] = useState(false)
    const [dept, setDept] = useState("general")

    const handleSend = async () => {
        if (!query.trim()) return

        const userMsg = { role: "user" as const, content: query }
        setMessages(prev => [...prev, userMsg])
        setQuery("")
        setLoading(true)

        try {
            const res = await api.post(`/query/${dept}`, { query: userMsg.content })
            const results = res.data.results || []

            let botResponse = ""
            if (results.length === 0) {
                botResponse = "I couldn't find any relevant documents that you have access to."
            } else {
                botResponse = `I found ${results.length} relevant documents:`
            }

            const botMsg = {
                role: "bot" as const,
                content: botResponse,
                sources: results
            }
            setMessages(prev => [...prev, botMsg])

        } catch (err: any) {
            console.error(err)
            if (err.response?.status === 403) {
                setMessages(prev => [...prev, { role: "bot", content: "🚫 Access Denied: You do not have permission to search in this department." }])
            } else {
                setMessages(prev => [...prev, { role: "bot", content: "❌ Error connecting to server." }])
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto p-4">
            {/* Header / Dept Selector */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 bg-white/5 rounded-lg border border-white/10 gap-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Bot className="text-blue-500" /> Secure RAG Chat
                </h2>
                <div className="flex gap-2 flex-wrap justify-center">
                    {["finance", "hr", "marketing", "engineering", "general"].map(d => (
                        <Badge
                            key={d}
                            variant={dept === d ? "default" : "outline"}
                            className={`cursor-pointer capitalize hover:bg-blue-600/50 ${dept === d ? 'bg-blue-600' : 'text-gray-400 border-gray-700'}`}
                            onClick={() => setDept(d)}
                        >
                            {d}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 bg-white/5 rounded-lg border border-white/10 p-4 mb-4 backdrop-blur-sm">
                <div className="space-y-6">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            {m.role === "bot" && <Avatar><AvatarFallback className="bg-blue-600 text-white"><Bot size={18} /></AvatarFallback></Avatar>}

                            <div className={`max-w-[85%] space-y-2`}>
                                <div className={`p-4 rounded-xl shadow-lg ${m.role === "user"
                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                                        : "bg-white/10 text-gray-100 rounded-bl-none border border-white/5"
                                    }`}>
                                    {m.content}
                                </div>

                                {/* Sources */}
                                {m.sources && m.sources.length > 0 && (
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                        {m.sources.map((s: any, idx: number) => (
                                            <Card key={idx} className="bg-black/40 border-white/10 p-3 hover:bg-black/60 transition-colors">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FileText size={14} className="text-blue-400" />
                                                    <span className="text-xs font-mono text-blue-300 uppercase">{s.metadata.department}</span>
                                                    <span className="text-xs text-xs text-gray-500 ml-auto">
                                                        Match: {(1 - s.score).toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{s.content}</p>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {m.role === "user" && <Avatar><AvatarFallback className="bg-purple-600 text-white"><User size={18} /></AvatarFallback></Avatar>}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <Avatar><AvatarFallback className="bg-blue-600"><Bot size={18} /></AvatarFallback></Avatar>
                            <div className="bg-white/10 p-3 rounded-lg text-gray-400 text-sm animate-pulse flex items-center gap-2">
                                Processing Request...
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                <Input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    placeholder={`Ask a question in ${dept.toUpperCase()} context...`}
                    className="bg-transparent border-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                />
                <Button onClick={handleSend} disabled={loading} className="bg-blue-600 hover:bg-blue-500 rounded-lg">
                    <Send size={18} />
                </Button>
            </div>
        </div>
    )
}
