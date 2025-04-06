import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Poppins } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"
import AuthGuard from "@/components/auth-guard"

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] })

export const metadata: Metadata = {
  title: "ExpiryEaze - Save More. Waste Less. Make an Impact.",
  description: "Discover unbeatable discounts on near-expiry food and medicines while helping the planet.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex flex-col min-h-screen`}>
        <AuthGuard>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthGuard>
      </body>
    </html>
  )
}



import './globals.css'