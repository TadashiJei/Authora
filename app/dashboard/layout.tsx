import type React from "react"
import DashboardNavigation from "@/components/dashboard-navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <DashboardNavigation />
      {children}
    </div>
  )
}
