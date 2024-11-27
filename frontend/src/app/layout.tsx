import React from "react"
import { Inter } from "next/font/google"
import { ToastContainer } from "react-toastify"
import { Header } from "@/components/layout"
import { ReactQueryProvider } from "@/providers/ReactQuery"
import type { Metadata } from "next"

import "./globals.css"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: "WayGO",
  description: "WayGO - Uma nova forma de se locomover",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
