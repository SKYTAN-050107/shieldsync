"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleSocialLogin = (provider: string) => {
    console.log("Social login with:", provider)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/images/gradient-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(6, 32, 17, 0.5) 0%, rgba(8, 46, 30, 0.4) 50%, rgba(4, 22, 12, 0.6) 100%)",
        }}
      />

      {/* Floating glass orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-[18%] left-[18%] w-36 h-36 rounded-full opacity-30 animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(52, 211, 153, 0.12) 0%, transparent 70%)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(52, 211, 153, 0.1)",
          }}
        />
        <div
          className="absolute top-[70%] right-[20%] w-28 h-28 rounded-full opacity-25 animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(110, 231, 183, 0.1) 0%, transparent 70%)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(110, 231, 183, 0.08)",
            animationDelay: "1.5s",
          }}
        />
        <div
          className="absolute top-[45%] right-[30%] w-20 h-20 rounded-full opacity-20 animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(167, 243, 208, 0.08) 0%, transparent 70%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(167, 243, 208, 0.06)",
            animationDelay: "0.8s",
          }}
        />
      </div>

      {/* Login Card */}
      <Card
        className="w-full max-w-[420px] relative z-10 border-0 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)",
          backdropFilter: "blur(48px) saturate(200%)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow:
            "0 24px 64px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        }}
      >
        <CardHeader className="text-center space-y-1 pb-2">
          {/* Leaf icon */}
          <div className="mx-auto mb-2 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)",
              border: "1px solid rgba(52, 211, 153, 0.15)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(110, 231, 183, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.78 10-10 11Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-white/95 font-sans text-balance">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-white/50 font-sans text-sm">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-7 pb-7">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-white/60 uppercase tracking-wider font-sans">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-white/10 bg-white/[0.06] placeholder:text-white/30 text-white/90 focus:ring-1 focus:ring-emerald-400/40 focus:border-emerald-400/30 focus:bg-white/[0.08] transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-white/60 uppercase tracking-wider font-sans">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-white/10 bg-white/[0.06] placeholder:text-white/30 text-white/90 focus:ring-1 focus:ring-emerald-400/40 focus:border-emerald-400/30 focus:bg-white/[0.08] transition-all duration-200"
                required
              />
            </div>

            <div className="flex justify-end">
              <a
                href="#"
                className="text-xs text-emerald-300/60 hover:text-emerald-300 font-sans transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-sans font-semibold text-sm transition-all duration-300 border-0"
              style={{
                background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                color: "#022c22",
                boxShadow: "0 4px 16px rgba(52, 211, 153, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] text-white/35 uppercase tracking-wider font-sans">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("Google")}
              className="flex-1 h-11 rounded-xl bg-transparent border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white/90 hover:border-white/15 font-sans transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 2.43-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSocialLogin("Apple")}
              className="flex-1 h-11 rounded-xl bg-transparent border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white/90 hover:border-white/15 font-sans transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              Apple
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSocialLogin("Meta")}
              className="flex-1 h-11 rounded-xl bg-transparent border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white/90 hover:border-white/15 font-sans transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
              </svg>
              Meta
            </Button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-xs text-white/40 font-sans">
            {"Don't have an account? "}
            <a href="#" className="text-emerald-300/70 hover:text-emerald-300 transition-colors duration-200">
              Create one
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
