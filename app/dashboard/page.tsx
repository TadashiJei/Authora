"use client"

import { useEffect, useMemo, useState } from "react"
import { useUser } from "@civic/auth-web3/react"
import {
  Wallet as WalletIcon,
  LinkIcon,
  BarChart3,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWalletBalances } from "@/hooks/use-wallet-balances"
import WalletOverview from "@/components/dashboard/wallet-overview"
import PaymentLinksOverview from "@/components/dashboard/payment-links-overview"

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const { totalUsd } = useWalletBalances()

  const [links, setLinks] = useState<{ earnings: number }[]>([])

  useEffect(() => {
    async function load() {
      if (!user) return
      const res = await fetch("/api/links", {
        headers: { "x-user-id": user.id || user.email || "" },
      })
      const json = await res.json()
      setLinks(json.links || [])
    }
    load()
  }, [user])

  const totalEarnings = useMemo(
    () => links.reduce((s, l) => s + (l.earnings || 0), 0),
    [links],
  )

  if (isLoading || !user) {
    return (
      <div className="pt-20 pb-8 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading…</p>
      </div>
    )
  }

  const formattedBalance =
    totalUsd > 0
      ? `$${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : "—"

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user.name || user.email}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 bg-white/50 backdrop-blur-sm mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="payments">Payment Links</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Portfolio Value",
                  value: formattedBalance,
                  icon: WalletIcon,
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  title: "Total Link Earnings",
                  value: `$${totalEarnings.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}`,
                  icon: BarChart3,
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Active Links",
                  value: links.length.toString(),
                  icon: LinkIcon,
                  gradient: "from-green-500 to-teal-500",
                },
              ].map((stat) => (
                <Card
                  key={stat.title}
                  className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <WalletOverview compact />
              <PaymentLinksOverview compact />
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <WalletOverview />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentLinksOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}