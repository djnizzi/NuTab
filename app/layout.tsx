import type React from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { BackgroundRotator } from "@/components/background-rotator"

const fredoka = localFont({
  src: "../public/fonts/Fredoka-Light.woff2",
  variable: "--font-sans",
  weight: "400",
})

export const metadata: Metadata = {
  title: "nu+ab",
  description: "a NiZ creation",
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#171717",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} font-sans antialiased`}>
        <BackgroundRotator />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
