"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  const [balanceVisible, setBalanceVisible] = useState(true)

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
              <p className="text-xl text-gray-600">Track your performance and earnings</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select defaultValue="30days">
                <SelectTrigger className="w-40 bg-white/50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Revenue",
              value: balanceVisible ? "$2,847.50" : "••••••",
              change: "+24.5%",
              icon: DollarSign,
              gradient: "from-green-500 to-teal-500",
            },
            {
              title: "Transactions",
              value: "47",
              change: "+12.3%",
              icon: TrendingUp,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              title: "Unique Clients",
              value: "23",
              change: "+8.7%",
              icon: Users,
              gradient: "from-purple-500 to-pink-500",
            },
            {
              title: "Avg. Transaction",
              value: balanceVisible ? "$60.59" : "••••••",
              change: "+5.2%",
              icon: BarChart3,
              gradient: "from-orange-500 to-red-500",
            },
          ].map((metric, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{metric.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                <p className="text-gray-600 text-sm">{metric.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Earnings Chart */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-purple-600" />
                  Earnings Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive chart visualization</p>
                    <p className="text-sm text-gray-500">Revenue trends over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Links */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Top Performing Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "General Services", earnings: "$1,247.50", percentage: 45, transactions: 23 },
                    { name: "Design Projects", earnings: "$875.00", percentage: 32, transactions: 12 },
                    { name: "Consulting", earnings: "$725.00", percentage: 23, transactions: 8 },
                  ].map((link, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-900 font-medium">{link.name}</span>
                          <p className="text-sm text-gray-600">{link.transactions} transactions</p>
                        </div>
                        <span className="text-gray-600 font-medium">{balanceVisible ? link.earnings : "••••••"}</span>
                      </div>
                      <Progress value={link.percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{link.percentage}% of total revenue</span>
                        <span>{balanceVisible ? link.earnings : "••••••"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Payment received",
                      client: "@client123",
                      amount: "+$125.00 USDC",
                      time: "2 hours ago",
                      link: "General Services",
                    },
                    {
                      action: "New client",
                      client: "@designer456",
                      amount: "+$75.50 ETH",
                      time: "5 hours ago",
                      link: "Design Projects",
                    },
                    {
                      action: "Payment received",
                      client: "@startup789",
                      amount: "+$200.00 USDC",
                      time: "1 day ago",
                      link: "Consulting",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">
                          {activity.client} via {activity.link}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{balanceVisible ? activity.amount : "••••••"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Key Metrics */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="text-gray-900 font-medium">12.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Transaction</span>
                  <span className="text-gray-900 font-medium">{balanceVisible ? "$60.59" : "••••••"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repeat Clients</span>
                  <span className="text-gray-900 font-medium">34%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate</span>
                  <span className="text-green-600 font-medium">+24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Links</span>
                  <span className="text-gray-900 font-medium">3</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Insights */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Customer Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">New vs Returning Clients</p>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-blue-200 h-2 rounded"></div>
                    <div className="flex-1 bg-green-200 h-2 rounded"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>New (66%)</span>
                    <span>Returning (34%)</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Payment Methods</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>USDC</span>
                      <span>65%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>ETH</span>
                      <span>25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SOL</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Geographic Distribution</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>North America</span>
                      <span>45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Europe</span>
                      <span>30%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Asia Pacific</span>
                      <span>25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Goals */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Monthly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Revenue Goal</span>
                    <span>{balanceVisible ? "$2,847 / $3,000" : "••••• / •••••"}</span>
                  </div>
                  <Progress value={95} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">95% complete</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Transaction Goal</span>
                    <span>47 / 50</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">94% complete</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>New Clients</span>
                    <span>15 / 20</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">75% complete</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
