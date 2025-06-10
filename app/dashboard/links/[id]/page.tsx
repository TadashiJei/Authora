"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Copy,
  QrCode,
  Trash2,
  Eye,
  Share,
  BarChart3,
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function LinkProfilePage() {
  const params = useParams()
  const linkId = params.id as string

  const [isActive, setIsActive] = useState(true)
  const [linkTitle, setLinkTitle] = useState("Premium Course Access")
  const [linkDescription, setLinkDescription] = useState("Get lifetime access to our premium Web3 development course")
  const [amount, setAmount] = useState("299")
  const [currency, setCurrency] = useState("USDC")

  // Mock data for the link
  const linkData = {
    id: linkId,
    title: "Premium Course Access",
    description: "Get lifetime access to our premium Web3 development course",
    amount: 299,
    currency: "USDC",
    url: `https://pay.authora.com/creator/${linkId}`,
    created: "2024-01-10",
    status: "active",
    totalEarned: 2985,
    totalPayments: 10,
    conversionRate: 15.5,
    views: 156,
  }

  const recentPayments = [
    {
      id: "pay_001",
      amount: 299,
      currency: "USDC",
      payer: "0x1234...5678",
      timestamp: "2024-01-15 14:30",
      status: "completed",
    },
    {
      id: "pay_002",
      amount: 299,
      currency: "USDC",
      payer: "0x8765...4321",
      timestamp: "2024-01-15 10:15",
      status: "completed",
    },
    {
      id: "pay_003",
      amount: 299,
      currency: "USDC",
      payer: "0x9876...1234",
      timestamp: "2024-01-14 16:45",
      status: "pending",
    },
  ]

  const analytics = {
    daily: [
      { date: "Jan 10", views: 12, payments: 1, revenue: 299 },
      { date: "Jan 11", views: 18, payments: 2, revenue: 598 },
      { date: "Jan 12", views: 25, payments: 1, revenue: 299 },
      { date: "Jan 13", views: 31, payments: 3, revenue: 897 },
      { date: "Jan 14", views: 22, payments: 2, revenue: 598 },
      { date: "Jan 15", views: 28, payments: 1, revenue: 299 },
    ],
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/links">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Links
              </Button>
            </Link>
            <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {linkData.title}
          </h1>
          <p className="text-gray-600 mt-2">{linkData.description}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earned</p>
                  <p className="text-2xl font-bold text-green-600">${linkData.totalEarned}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold text-blue-600">{linkData.totalPayments}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Views</p>
                  <p className="text-2xl font-bold text-purple-600">{linkData.views}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion</p>
                  <p className="text-2xl font-bold text-orange-600">{linkData.conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Link Details */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Link Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment URL</Label>
                    <div className="flex gap-2">
                      <Input value={linkData.url} readOnly className="flex-1" />
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(linkData.url)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Amount</Label>
                      <p className="text-lg font-semibold">
                        {linkData.amount} {linkData.currency}
                      </p>
                    </div>
                    <div>
                      <Label>Created</Label>
                      <p className="text-lg font-semibold">{linkData.created}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Share className="w-4 h-4 mr-2" />
                      Share Link
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPayments.slice(0, 3).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${payment.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}
                          />
                          <div>
                            <p className="font-medium">
                              {payment.amount} {payment.currency}
                            </p>
                            <p className="text-sm text-gray-600">{payment.payer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {payment.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{payment.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Track your link's performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Chart placeholder */}
                  <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                      <p className="text-gray-600">Analytics chart would go here</p>
                    </div>
                  </div>

                  {/* Daily breakdown */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Daily Breakdown</h3>
                    {analytics.daily.map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <span className="font-medium">{day.date}</span>
                        <div className="flex gap-6 text-sm">
                          <span>{day.views} views</span>
                          <span>{day.payments} payments</span>
                          <span className="font-semibold">${day.revenue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>All payments received through this link</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${payment.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}
                        />
                        <div>
                          <p className="font-medium">
                            {payment.amount} {payment.currency}
                          </p>
                          <p className="text-sm text-gray-600">From: {payment.payer}</p>
                          <p className="text-xs text-gray-500">{payment.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {payment.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">ID: {payment.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Link Settings</CardTitle>
                <CardDescription>Configure your payment link settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Link Status</Label>
                    <p className="text-sm text-gray-500">Enable or disable this payment link</p>
                  </div>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Link Title</Label>
                  <Input id="title" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={linkDescription}
                    onChange={(e) => setLinkDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      placeholder="USDC"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
