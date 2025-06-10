"use client"

import { useState } from "react"
import { Copy, QrCode, Plus, LinkIcon, TrendingUp, Users, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LinksPage() {
  const [balanceVisible, setBalanceVisible] = useState(true)

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Links</h1>
              <p className="text-xl text-gray-600">Create and manage your payment links</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Link
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium">3 Active</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
              <p className="text-gray-600 text-sm">Total Links</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium">+24%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{balanceVisible ? "$2,847.50" : "••••••"}</h3>
              <p className="text-gray-600 text-sm">Total Earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-600 font-medium">+12</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">43</h3>
              <p className="text-gray-600 text-sm">Total Transactions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Links List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Your Payment Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "General Services",
                    url: "authora.xyz/@creator",
                    earnings: "$1,247.50",
                    transactions: 23,
                    status: "Active",
                    created: "2 weeks ago",
                    description: "General freelance services and consultations",
                  },
                  {
                    name: "Design Projects",
                    url: "authora.xyz/@creator/design",
                    earnings: "$875.00",
                    transactions: 12,
                    status: "Active",
                    created: "1 week ago",
                    description: "UI/UX design and branding services",
                  },
                  {
                    name: "Consulting",
                    url: "authora.xyz/@creator/consulting",
                    earnings: "$725.00",
                    transactions: 8,
                    status: "Paused",
                    created: "3 days ago",
                    description: "Business strategy and technical consulting",
                  },
                ].map((link, index) => (
                  <Card
                    key={index}
                    className="bg-white/20 border-white/30 hover:bg-white/30 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg text-gray-900">{link.name}</CardTitle>
                          <p className="text-blue-600 font-mono text-sm">{link.url}</p>
                          <p className="text-gray-600 text-sm mt-1">{link.description}</p>
                        </div>
                        <Badge
                          className={
                            link.status === "Active"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }
                        >
                          {link.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Earnings</p>
                          <p className="text-lg font-bold text-gray-900">{balanceVisible ? link.earnings : "••••••"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Transactions</p>
                          <p className="text-lg font-bold text-gray-900">{link.transactions}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Created {link.created}</p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          QR Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Create New Link Form */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Create New Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="link-name" className="text-gray-700 font-medium">
                    Link Name
                  </Label>
                  <Input
                    id="link-name"
                    placeholder="e.g., Design Services"
                    className="mt-2 bg-white/50 border-gray-200"
                  />
                </div>
                <div>
                  <Label htmlFor="link-description" className="text-gray-700 font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="link-description"
                    placeholder="Describe what you're offering..."
                    className="mt-2 bg-white/50 border-gray-200"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="link-amount" className="text-gray-700 font-medium">
                    Amount (Optional)
                  </Label>
                  <Input id="link-amount" placeholder="e.g., $100" className="mt-2 bg-white/50 border-gray-200" />
                </div>
                <div>
                  <Label htmlFor="link-currency" className="text-gray-700 font-medium">
                    Preferred Currency
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-2 bg-white/50 border-gray-200">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usdc">USDC</SelectItem>
                      <SelectItem value="eth">ETH</SelectItem>
                      <SelectItem value="sol">SOL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Link
                </Button>
              </CardContent>
            </Card>

            {/* Link Management Tips */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">📝 Clear Descriptions</p>
                  <p>Write clear descriptions to help clients understand what they're paying for.</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">💰 Flexible Pricing</p>
                  <p>Leave amount empty to let clients choose their own amount.</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">🔗 Share Everywhere</p>
                  <p>Add your payment links to your bio, website, and social media.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
