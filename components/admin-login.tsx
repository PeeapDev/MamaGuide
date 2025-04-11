"use client"

import type React from "react"

import { useState } from "react"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface AdminLoginProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Default users for demo purposes
const DEFAULT_USERS = [
  { username: "superadmin", password: "super123", role: "superadmin" },
  { username: "admin", password: "admin123", role: "admin" },
]

export default function AdminLogin({ open, onOpenChange }: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setError("")

    // Simple authentication logic
    const user = DEFAULT_USERS.find((user) => user.username === username && user.password === password)

    setTimeout(() => {
      setIsLoggingIn(false)

      if (user) {
        // In a real app, you would use a proper auth system
        // For demo, we'll store the user in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            username: user.username,
            role: user.role,
          }),
        )

        // Redirect to admin dashboard
        router.push("/admin/dashboard")
        onOpenChange(false)
      } else {
        setError("Invalid username or password")
      }
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-[#00866a]" />
            Admin Dashboard Login
          </DialogTitle>
          <DialogDescription>
            Access the healthcare provider dashboard to manage patient data and medical forms.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm">{error}</div>}

          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium mb-2 text-[#00866a]">Demo Credentials</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p>
                <strong>Superadmin:</strong> username: superadmin, password: super123
              </p>
              <p>
                <strong>Admin:</strong> username: admin, password: admin123
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoggingIn}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#00866a] hover:bg-[#00866a]/90" disabled={isLoggingIn}>
              {isLoggingIn ? "Logging in..." : "Login to Dashboard"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
