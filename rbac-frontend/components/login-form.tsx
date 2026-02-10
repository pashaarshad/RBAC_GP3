"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, User, Shield, Briefcase, Users } from "lucide-react"

const DEMO_CREDENTIALS = [
    { username: "admin", password: "admin123", role: "C-Level", icon: Shield, color: "from-purple-500 to-indigo-500" },
    { username: "finance_user", password: "pass123", role: "Finance", icon: Briefcase, color: "from-green-500 to-emerald-500" },
    { username: "hr_user", password: "pass123", role: "HR", icon: Users, color: "from-blue-500 to-cyan-500" },
    { username: "marketing_user", password: "pass123", role: "Marketing", icon: User, color: "from-orange-500 to-amber-500" },
]

export default function LoginForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await api.post("/auth/login", { username, password })
            const { access_token, role, username: returnedUsername } = res.data

            localStorage.setItem("access_token", access_token)
            localStorage.setItem("username", returnedUsername || username)
            localStorage.setItem("user_role", role) // Store user role

            // Map role to display name
            const roleDisplay: Record<string, string> = {
                "c-level": "Admin",
                "finance": "Finance Manager",
                "hr": "HR Manager",
                "marketing": "Marketing Manager",
                "engineering": "Engineering Manager"
            }
            const displayName = roleDisplay[role?.toLowerCase() || ""] || role

            toast.success("Login successful", {
                description: `Welcome back, ${displayName}!`
            })
            router.push("/dashboard")
        } catch (err: any) {
            console.error(err)
            toast.error("Invalid credentials", {
                description: "Please check your username and password."
            })
        } finally {
            setLoading(false)
        }
    }

    const fillCredentials = (user: typeof DEMO_CREDENTIALS[0]) => {
        setUsername(user.username)
        setPassword(user.password)
        toast.info(`Demo: ${user.role}`, {
            description: `Credentials filled for ${user.username}`
        })
    }

    // Custom Logo Component
    const ShieldLogo = () => (
        <div className="relative w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
            <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    <path d="M12 2L3 7V12C3 17.52 6.84 22.74 12 24C17.16 22.74 21 17.52 21 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    )

    return (
        <Card className="border-white/10 bg-black/40 text-white backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <CardHeader className="text-center pb-2 relative z-10">
                <ShieldLogo />
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    Secure Access
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Enterprise RBAC Authentication Portal
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
                {/* Quick Fill Demo Credentials */}
                <div className="space-y-3">
                    <Label className="text-xs text-gray-500 uppercase tracking-widest font-semibold ml-1">Quick Demo Access</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {DEMO_CREDENTIALS.map((cred) => (
                            <button
                                key={cred.username}
                                type="button"
                                onClick={() => fillCredentials(cred)}
                                className="group relative flex items-center gap-3 p-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all hover:border-white/10 overflow-hidden"
                            >
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cred.color} bg-opacity-20 flex items-center justify-center shrink-0 shadow-lg`}>
                                    <cred.icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{cred.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-gray-600 font-mono">or enter manually</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-xs uppercase tracking-wide text-gray-500 ml-1">Username</Label>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Input
                                id="username"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="relative bg-black/40 border-white/10 text-white placeholder:text-gray-700 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 h-12 text-sm rounded-xl pl-4 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs uppercase tracking-wide text-gray-500 ml-1">Password</Label>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative bg-black/40 border-white/10 text-white placeholder:text-gray-700 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 h-12 text-sm rounded-xl pl-4 transition-all"
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0 h-12 text-sm font-semibold tracking-wide shadow-lg shadow-blue-900/20 transition-all hover:shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] rounded-xl mt-2"
                        disabled={loading || !username || !password}
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In Securely"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center text-[10px] text-gray-600 border-t border-white/5 pt-4 pb-4">
                Protected by Enterprise RBAC • AES-256 Encryption
            </CardFooter>
        </Card>
    )
}
