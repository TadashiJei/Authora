import type React from "react"
import type { Metadata } from "next";
import { CivicAuthProvider } from '@civic/auth-web3/nextjs';
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
})

export const metadata: Metadata = {
  title: "Authora - Frictionless Web3 Onboarding",
  description: "One Link. Verified Identity. Embedded Wallet. Accept crypto payments with zero friction.",
    generator: 'tadashijei.com'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <CivicAuthProvider>
          <Navigation />
          {children}
          <Footer />
        </CivicAuthProvider>
      </body>
    </html>
  )
}
