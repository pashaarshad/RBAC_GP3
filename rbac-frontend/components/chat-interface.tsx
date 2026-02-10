"use client"

import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, FileText, BarChart3, Zap, FileSearch } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Metrics {
    documents_retrieved: number
    avg_similarity: number
    llm_enabled: boolean
    model: string | null
    context_tokens: number
}

interface Message {
    role: "user" | "bot"
    content: string
    sources?: any[]
    metrics?: Metrics
}

export default function ChatInterface() {
    const [query, setQuery] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hello! I am your RBAC-secured assistant. Select a department context and ask me anything." }
    ])
    const [loading, setLoading] = useState(false)
    const [dept, setDept] = useState("general")
    const [username, setUsername] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<string | null>(null)

    // Suggested questions per department - organized by access type
    const suggestedQuestions: Record<string, { authorized: string[], testUnauthorized: string[] }> = {
        finance: {
            authorized: [
                "What is the Q4 2024 revenue?",
                "What was the gross margin in 2024?",
                "What are the vendor costs breakdown?"
            ],
            testUnauthorized: [
                "❌ Test: What is the leave policy?", // HR question
                "❌ Test: What is the weather today?" // Unrelated
            ]
        },
        hr: {
            authorized: [
                "What is the leave policy?",
                "What are the employee benefits?",
                "How does the performance review process work?"
            ],
            testUnauthorized: [
                "❌ Test: What was the Q4 2024 revenue?", // Finance question
                "❌ Test: Tell me a joke" // Unrelated
            ]
        },
        marketing: {
            authorized: [
                "What was the marketing ROI in 2024?",
                "How many new customers were acquired?",
                "What digital campaigns were launched?"
            ],
            testUnauthorized: [
                "❌ Test: What is the employee exit policy?", // HR question
                "❌ Test: Who won the football match?" // Unrelated
            ]
        },
        engineering: {
            authorized: [
                "What is the system architecture?",
                "What technologies are used in production?",
                "What is the deployment process?"
            ],
            testUnauthorized: [
                "❌ Test: What is the marketing budget?", // Marketing question
                "❌ Test: How to cook pasta?" // Unrelated
            ]
        },
        general: {
            authorized: [
                "What is FinSolve Technologies?",
                "What are the company values?",
                "What is the work from home policy?"
            ],
            testUnauthorized: [
                "❌ Test: What is the Q4 revenue?", // Finance question (general users can't access)
                "❌ Test: Give me investment advice" // Unrelated
            ]
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUsername(localStorage.getItem("username"))
            setUserRole(localStorage.getItem("user_role"))
        }
    }, [])

    // Get display name based on role and department
    const getDisplayName = () => {
        if (!userRole) return username || "User"

        const roleMap: Record<string, string> = {
            "c-level": "Admin",
            "finance": "Finance",
            "hr": "HR",
            "marketing": "Marketing",
            "engineering": "Engineering"
        }

        const baseRole = roleMap[userRole.toLowerCase()] || userRole

        // For C-level, show department context
        if (userRole.toLowerCase() === "c-level") {
            const deptMap: Record<string, string> = {
                "finance": "Admin (Finance)",
                "hr": "Admin (HR)",
                "marketing": "Admin (Marketing)",
                "engineering": "Admin (Engineering)",
                "general": "Admin"
            }
            return deptMap[dept] || "Admin"
        }

        return baseRole
    }

    const handleSuggestedClick = (question: string) => {
        setQuery(question)
    }

    const handleSend = async () => {
        if (!query.trim()) return

        const userMsg = { role: "user" as const, content: query }
        setMessages(prev => [...prev, userMsg])
        setQuery("")
        setLoading(true)

        try {
            const res = await api.post(`/query/${dept}`, { query: userMsg.content })
            const { response, results, metrics } = res.data

            const botMsg = {
                role: "bot" as const,
                content: response || "I couldn't find any relevant documents that you have access to.",
                sources: results || [],
                metrics: metrics
            }
            setMessages(prev => [...prev, botMsg])

        } catch (err: any) {
            console.error(err)
            if (err.response?.status === 403) {
                setMessages(prev => [...prev, { role: "bot", content: "🚫 Access Denied: You do not have permission to search in this department." }])
            } else if (err.response?.status === 401) {
                setMessages(prev => [...prev, { role: "bot", content: "🔐 Session expired. Please log in again." }])
            } else {
                setMessages(prev => [...prev, { role: "bot", content: "❌ Error connecting to server." }])
            }
        } finally {
            setLoading(false)
        }
    }

    // Custom Logo Component
    const ShieldLogo = () => (
        <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 animate-pulse"></div>
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 relative z-10 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                <path d="M12 2L3 7V12C3 17.52 6.84 22.74 12 24C17.16 22.74 21 17.52 21 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto p-4 md:p-8 relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 glass-panel rounded-2xl border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                        <ShieldLogo />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                            Secure<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">RBAC</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-widest font-mono">Enterprise</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Welcome back, <span className="text-white font-medium">{getDisplayName()}</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Security Level</p>
                        <p className="text-sm text-green-400 font-mono flex items-center justify-end gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            ENCRYPTED
                        </p>
                    </div>
                </div>
            </div>

            {/* Department Selector as Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 relative z-10">
                {[
                    { id: 'finance', icon: BarChart3, label: 'Finance', color: 'text-green-400', bg: 'hover:bg-green-500/10' },
                    { id: 'hr', icon: Users, label: 'HR', color: 'text-pink-400', bg: 'hover:bg-pink-500/10' },
                    { id: 'marketing', icon: Zap, label: 'Marketing', color: 'text-orange-400', bg: 'hover:bg-orange-500/10' },
                    { id: 'engineering', icon: Bot, label: 'Engineering', color: 'text-cyan-400', bg: 'hover:bg-cyan-500/10' },
                    { id: 'general', icon: FileText, label: 'General', color: 'text-gray-400', bg: 'hover:bg-gray-500/10' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setDept(item.id)}
                        className={`
                            glass-card p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group
                            ${dept === item.id
                                ? 'bg-white/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] transform scale-[1.02]'
                                : `opacity-70 hover:opacity-100 ${item.bg}`
                            }
                        `}
                    >
                        <item.icon className={`w-6 h-6 ${dept === item.id ? item.color : 'text-gray-500 group-hover:text-white'} transition-colors`} />
                        <span className={`text-xs font-medium tracking-wide ${dept === item.id ? 'text-white' : 'text-gray-400'}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Info Banner */}
            {userRole?.toLowerCase() === 'c-level' && (
                <div className="mb-4 glass-panel p-3 rounded-lg flex items-start gap-3 border-l-4 border-l-purple-500/80">
                    <div className="bg-purple-500/20 p-1.5 rounded-full mt-0.5">
                        <Zap size={14} className="text-purple-400" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Admin Mode Active</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            You have unrestricted access to all department documents. Context strictly set to: <span className="text-purple-300">{dept.charAt(0).toUpperCase() + dept.slice(1)}</span>.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-0 glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative">
                {/* Chat History */}
                <ScrollArea className="flex-1 p-4 md:p-6 bg-transparent">
                    <div className="space-y-6">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                {m.role === "bot" && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mt-1 shrink-0">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                )}

                                <div className={`max-w-[85%] space-y-3`}>
                                    <div className={`p-5 rounded-2xl shadow-md backdrop-blur-sm border ${m.role === "user"
                                            ? "bg-blue-600/90 text-white rounded-br-sm border-blue-500/50"
                                            : "bg-white/5 text-gray-100 rounded-bl-sm border-white/10"
                                        }`}>
                                        <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">{m.content}</p>
                                    </div>

                                    {/* Metrics Panel */}
                                    {m.metrics && (
                                        <div className="flex flex-wrap gap-2 px-1 animate-in fade-in duration-500">
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                                                <FileSearch size={10} className="text-blue-400" />
                                                <span>{m.metrics.documents_retrieved} docs</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                                                <BarChart3 size={10} className="text-green-400" />
                                                <span>{(m.metrics.avg_similarity * 100).toFixed(0)}% match</span>
                                            </div>
                                            {m.metrics.llm_enabled && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-black/20 px-2 py-1 rounded-full border border-white/5">
                                                    <Zap size={10} className="text-yellow-400" />
                                                    <span>{m.metrics.model?.split('/')[1] || 'AI'}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Sources Cards */}
                                    {m.sources && m.sources.length > 0 && (
                                        <div className="grid grid-cols-1 gap-2 pt-1">
                                            {m.sources.slice(0, 3).map((s: any, idx: number) => (
                                                <div key={idx} className="bg-black/30 border border-white/10 p-3 rounded-lg hover:bg-black/40 transition-colors pl-3 border-l-2 border-l-blue-500/50">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <FileText size={12} className="text-blue-400" />
                                                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">{s.metadata?.department || 'Document'}</span>
                                                        <span className="text-[10px] text-gray-500 ml-auto font-mono">
                                                            {((1 - (s.score || 0.5)) * 100).toFixed(0)}% RELEVANCE
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed opacity-90">{s.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {m.role === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mt-1 shrink-0">
                                        <User size={16} className="text-white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-4 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-white/10 shrink-0"></div>
                                <div className="space-y-2 w-full max-w-xs">
                                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                    <div className="h-4 bg-white/5 rounded w-1/2"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 bg-black/20 backdrop-blur-md border-t border-white/5">
                    {/* Suggestions */}
                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-2 mask-linear">
                        {suggestedQuestions[dept]?.authorized.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestedClick(q)}
                                className="whitespace-nowrap text-xs px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 rounded-full text-blue-300 hover:text-white transition-all duration-300"
                            >
                                {q}
                            </button>
                        ))}
                        {suggestedQuestions[dept]?.testUnauthorized.map((q, idx) => (
                            <button
                                key={`test-${idx}`}
                                onClick={() => handleSuggestedClick(q.replace('❌ Test: ', ''))}
                                className="whitespace-nowrap text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-full text-red-300 hover:text-red-200 transition-all duration-300"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 relative">
                        <Input
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !loading && handleSend()}
                            placeholder={`Analyze authorized ${dept.toUpperCase()} documents...`}
                            className="bg-black/20 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 placeholder:text-gray-600 h-12 pl-4 rounded-xl pr-14"
                        />
                        <div className="absolute right-1.5 top-1.5">
                            <Button
                                onClick={handleSend}
                                disabled={loading || !query.trim()}
                                className="h-9 w-9 p-0 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send size={16} />
                            </Button>
                        </div>
                    </div>
                    <div className="text-[10px] text-center text-gray-600 mt-2 font-mono">
                        SECURE CONNECTION • 256-BIT ENCRYPTION • RBAC ENABLED
                    </div>
                </div>
            </div>
        </div>
    )
}
