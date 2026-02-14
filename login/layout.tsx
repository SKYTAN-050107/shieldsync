import type React from "react"
import type { Metadata } from "next"
import { Public_Sans } from "next/font/google"
import "./globals.css"

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Login - Liquid Glass UI",
  description: "Elegant login page with Apple-inspired liquid glass effect",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
