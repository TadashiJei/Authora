"use client"

import { useState } from "react"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Wallet,
  Shield,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WalletActions from "@/components/wallet-actions"

export default function WalletPage() {
  const [balanceVisible, setBalanceVisible] = useState(true)

  const transactions = [
    {
      type: "received",
      amount: "+$125.00",
      token: "USDC",
      from: "Client Payment",
      time: "2 hours ago",
      hash: "0x1234...5678",
      icon: ArrowDownLeft,
      color: "text-green-600",
    },
    {
      type: "received",
      amount: "+$75.50",
      token: "ETH",
      from: "Freelance Work",
      time: "1 day ago",
      hash: "0x2345...6789",
      icon: ArrowDownLeft,
      color: "text-green-600",
    },
    {
      type: "sent",
      amount: "-$25.00",
      token: "USDC",
      from: "Gas Fee",
      time: "2 days ago",
      hash: "0x3456...7890",
      icon: ArrowUpRight,
      color: "text-red-600",
    },
  ]

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Wallet</h1>
              <p className="text-xl text-gray-600">Manage your crypto assets and transactions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export History
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Overview */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center justify-between">
                  <div className="flex items-center">
                    <Wallet className="w-6 h-6 mr-3 text-purple-600" />
                    Your Wallet
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
                      <p className="text-3xl font-bold text-gray-900">{balanceVisible ? "$2,847.50" : "••••••••"}</p>
                      <p className="text-sm text-green-600">+12.5% this month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Wallet Address</p>
                      <p className="font-mono text-sm text-gray-800">0x742d...8f3a</p>
                      <Button size="sm" variant="outline" className="bg-white/50 border-white/30 mt-2">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Token Balances */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Token Balances</h4>
                  {[
                    {
                      symbol: "USDC",
                      name: "USD Coin",
                      balance: "1,847.50",
                      value: "$1,847.50",
                      change: "+2.1%",
                      logo: "💰",
                    },
                    {
                      symbol: "ETH",
                      name: "Ethereum",
                      balance: "0.5234",
                      value: "$1,000.00",
                      change: "+5.2%",
                      logo: "⟠",
                    },
                    {
                      symbol: "SOL",
                      name: "Solana",
                      balance: "12.45",
                      value: "$0.00",
                      change: "0%",
                      logo: "◎",
                    },
                  ].map((token, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/30 rounded-xl hover:bg-white/40 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">{token.logo}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{token.symbol}</p>
                          <p className="text-sm text-gray-600">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{balanceVisible ? token.balance : "••••••"}</p>
                        <p className="text-sm text-gray-600">{balanceVisible ? token.value : "••••••"}</p>
                        <p className={`text-xs ${token.change.startsWith("+") ? "text-green-600" : "text-gray-500"}`}>
                          {token.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center justify-between">
                  Transaction History
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 bg-white/20 border-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 ${tx.type === "received" ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center`}
                        >
                          <tx.icon className={`w-5 h-5 ${tx.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.from}</p>
                          <p className="text-sm text-gray-600">{tx.time}</p>
                          <p className="text-xs text-gray-500 font-mono">{tx.hash}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.color}`}>{balanceVisible ? tx.amount : "••••••"}</p>
                        <p className="text-sm text-gray-600">{tx.token}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Actions and Security */}
          <div className="space-y-6">
            <WalletActions walletAddress="0x742d35Cc6634C0532925a3b8D4C0532925a3b8f3a" transactions={transactions.map(tx => ({
              hash: tx.hash,
              amount: tx.amount,
              token: tx.token,
              timestamp: tx.time,
            }))} />

            {/* Security Status */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Civic Verification</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Wallet Security</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Secure</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">2FA Enabled</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup Status</span>
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}