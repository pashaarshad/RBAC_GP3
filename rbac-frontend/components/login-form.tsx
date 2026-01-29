"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

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
            const { access_token } = res.data

            // Decode role roughly or fetch profile
            // For now just store token
            localStorage.setItem("access_token", access_token)
            localStorage.setItem("username", username)

            toast.success("Login successful")
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

    return (
        <Card className="border-white/10 bg-black/40 text-white backdrop-blur-xl shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    RBAC Access
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Enter your secure credentials to continue.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center text-xs text-gray-500 border-t border-white/5 pt-4">
                Secured by Enterprise RBAC System
            </CardFooter>
        </Card>
    )
}
