import type { Metadata } from "next"
import localFont from "next/font/local"
import { ThemeProvider } from "next-themes"

import "./globals.css"

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"

import { Toaster } from "@/components/ui/toaster"

import { fileRouter } from "./api/uploadthing/core"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    template: "%s | bugbook",
    default: "bugbook",
  },
  description: "The social media app for powernerds",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-svh`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
          <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
