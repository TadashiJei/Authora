"use client";

import { useState, useEffect } from "react";
import { useUser } from '@civic/auth-web3/react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  QrCode,
  Wallet,
  TrendingUp,
  Shield,
  Zap,
  Plus,
  Settings,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  CreditCard,
  BarChart3,
  Users,
  LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const civicAuth = useUser();
  const { user, isLoading, error: authError } = civicAuth;
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [notifications, setNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState("Digital creator & freelancer")
  const [currency, setCurrency] = useState("usd")
  const [timezone, setTimezone] = useState("pht");
  const ethAddress = (civicAuth as any).ethereum?.address;
  const solAddress = (civicAuth as any).solana?.address; // Also capture Solana address if needed later

  useEffect(() => {
    if (user) {
      setUsername(user.name || '');
      setEmail(user.email || '');
      // You could also set other user-dependent states here
    }
  }, [user]); // This effect runs when the `user` object changes

  useEffect(() => {
    const button = document.getElementById('wallet-tab-copy-button');
    if (button) {
      const handleClick = () => {
        console.log('VANILLA JS CLICK LISTENER FIRED for wallet-tab-copy-button! ethAddress:', (civicAuth as any).ethereum?.address);
      };
      button.addEventListener('click', handleClick);
      console.log('Vanilla JS event listener attached to wallet-tab-copy-button');
      return () => {
        button.removeEventListener('click', handleClick);
        console.log('Vanilla JS event listener removed from wallet-tab-copy-button');
      };
    } else {
      console.warn('Could not find wallet-tab-copy-button to attach vanilla listener');
    }
  }, [civicAuth]); // Re-run if civicAuth changes, though address is read directly

  if (isLoading) {
    return (
      <div className="pt-20 pb-8 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading dashboard...</p>
        {/* TODO: Add a spinner component */}
      </div>
    );
  }

  if (authError) {
    return (
      <div className="pt-20 pb-8 min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-red-600">Error loading user data:</p>
        <p className="text-gray-700">{authError.message}</p>
        {/* TODO: Add a retry button or link to login */}
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by middleware redirecting to login
    // but as a fallback:
    return (
      <div className="pt-20 pb-8 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please log in to view the dashboard.</p>
        {/* Optionally, include the AuthButton here or a link to login */}
      </div>
    );
  }

  // Log the full result from the useUser() hook
  console.log('Civic useUser() Hook Result:', civicAuth);

  return (
    <div className="pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-xl text-gray-600">Welcome back, {user.name || user.email}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Civic Verified
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Wallet
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Payment Links
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Balance",
                  value: balanceVisible ? "$2,847.50" : "••••••",
                  change: "+12.5%",
                  icon: Wallet,
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  title: "This Month",
                  value: balanceVisible ? "$1,234.00" : "••••••",
                  change: "+8.2%",
                  icon: TrendingUp,
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Transactions",
                  value: "47",
                  change: "+15",
                  icon: ArrowUpRight,
                  gradient: "from-green-500 to-teal-500",
                },
                {
                  title: "Payment Links",
                  value: "3",
                  change: "Active",
                  icon: Zap,
                  gradient: "from-orange-500 to-red-500",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 flex items-center justify-between">
                      Recent Activity
                      <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                        View All
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          type: "payment",
                          title: "Payment Received",
                          description: "From @client123 via authora.xyz/@creator",
                          amount: "+$125.00 USDC",
                          time: "2 hours ago",
                          icon: ArrowDownLeft,
                          color: "text-green-600",
                          bgColor: "bg-green-100",
                        },
                        {
                          type: "link",
                          title: "New Payment Link Created",
                          description: "Design Services - authora.xyz/@creator/design",
                          amount: "",
                          time: "5 hours ago",
                          icon: LinkIcon,
                          color: "text-blue-600",
                          bgColor: "bg-blue-100",
                        },
                        {
                          type: "payment",
                          title: "Payment Received",
                          description: "From @freelancer456 via QR code",
                          amount: "+$75.50 ETH",
                          time: "1 day ago",
                          icon: ArrowDownLeft,
                          color: "text-green-600",
                          bgColor: "bg-green-100",
                        },
                        {
                          type: "verification",
                          title: "Identity Verified",
                          description: "Civic Auth verification completed successfully",
                          amount: "",
                          time: "2 days ago",
                          icon: Shield,
                          color: "text-purple-600",
                          bgColor: "bg-purple-100",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}
                            >
                              <activity.icon className={`w-5 h-5 ${activity.color}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                          {activity.amount && (
                            <div className="text-right">
                              <p className={`font-medium ${activity.color}`}>{activity.amount}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Payment Link
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Wallet Address
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* Profile Summary */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl text-white font-bold">C</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Creator Profile</h3>
                    <p className="text-gray-600 mb-4">@creator</p>
                    <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 mb-4">
                      <Shield className="w-3 h-3 mr-1" />
                      Civic Verified
                    </Badge>
                    <Separator className="my-4" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member since</span>
                        <span className="text-gray-900">Dec 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total earned</span>
                        <span className="text-gray-900">{balanceVisible ? "$5,247.50" : "••••••"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success rate</span>
                        <span className="text-gray-900">98.5%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-8">
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
                          <p className="text-3xl font-bold text-gray-900">
                            {balanceVisible ? "$2,847.50" : "••••••••"}
                          </p>
                          <p className="text-sm text-green-600">+12.5% this month</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Wallet Address</p>
                          <p className="font-mono text-sm text-gray-800 truncate" title={ethAddress || 'No address available'}>{ethAddress ? `${ethAddress.substring(0, 6)}...${ethAddress.substring(ethAddress.length - 4)}` : 'N/A'}</p>
                          <Button id="wallet-tab-copy-button" size="sm" variant="outline" className="bg-white/50 border-white/30 mt-2" onClick={() => {
                            console.log('WALLET TAB COPY BUTTON CLICKED! ethAddress:', ethAddress);
                          }} disabled={!ethAddress} title={ethAddress ? "Copy Address" : "Address not available"}>
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
                            <p
                              className={`text-xs ${token.change.startsWith("+") ? "text-green-600" : "text-gray-500"}`}
                            >
                              {token.change}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-4 border-gray-200 text-gray-700 hover:bg-gray-50"
                          >
                            Send
                          </Button>
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
                      {[
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
                      ].map((tx, index) => (
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

              {/* Wallet Actions */}
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Wallet Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                      <ArrowDownLeft className="w-4 h-4 mr-2" />
                      Receive Crypto
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Send Crypto
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Crypto
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export History
                    </Button>
                  </CardContent>
                </Card>

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
                    <Button variant="outline" className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 mt-4">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Payment Links Tab */}
          <TabsContent value="payments" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Payment Links</h2>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Link
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  name: "General Services",
                  url: "authora.xyz/@creator",
                  earnings: "$1,247.50",
                  transactions: 23,
                  status: "Active",
                  created: "2 weeks ago",
                },
                {
                  name: "Design Projects",
                  url: "authora.xyz/@creator/design",
                  earnings: "$875.00",
                  transactions: 12,
                  status: "Active",
                  created: "1 week ago",
                },
                {
                  name: "Consulting",
                  url: "authora.xyz/@creator/consulting",
                  earnings: "$725.00",
                  transactions: 8,
                  status: "Paused",
                  created: "3 days ago",
                },
              ].map((link, index) => (
                <Card
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-gray-900">{link.name}</CardTitle>
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
                    <p className="text-blue-600 font-mono text-sm">{link.url}</p>
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
                        <Settings className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 flex items-center">
                      <BarChart3 className="w-6 h-6 mr-3 text-purple-600" />
                      Earnings Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                      <p className="text-gray-600">Chart visualization would go here</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900">Top Performing Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "General Services", earnings: "$1,247.50", percentage: 45 },
                        { name: "Design Projects", earnings: "$875.00", percentage: 32 },
                        { name: "Consulting", earnings: "$725.00", percentage: 23 },
                      ].map((link, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-900 font-medium">{link.name}</span>
                            <span className="text-gray-600">{balanceVisible ? link.earnings : "••••••"}</span>
                          </div>
                          <Progress value={link.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
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
                      <span className="text-gray-900 font-medium">{balanceVisible ? "$125.50" : "••••••"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repeat Customers</span>
                      <span className="text-gray-900 font-medium">34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="text-green-600 font-medium">+24%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Customer Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">New vs Returning</p>
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="username" className="text-gray-700 font-medium">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-2 bg-white/50 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 bg-white/50 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-gray-700 font-medium">
                        Bio
                      </Label>
                      <Input
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-2 bg-white/50 border-gray-200"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="balance-visibility" className="text-gray-700 font-medium">
                          Show Balance
                        </Label>
                        <p className="text-sm text-gray-600">Display your balance in the dashboard</p>
                      </div>
                      <Switch id="balance-visibility" checked={balanceVisible} onCheckedChange={setBalanceVisible} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="public-profile" className="text-gray-700 font-medium">
                          Public Profile
                        </Label>
                        <p className="text-sm text-gray-600">Make your profile visible to others</p>
                      </div>
                      <Switch id="public-profile" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="analytics" className="text-gray-700 font-medium">
                          Analytics Tracking
                        </Label>
                        <p className="text-sm text-gray-600">Allow us to collect usage analytics</p>
                      </div>
                      <Switch id="analytics" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-gray-700 font-medium">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <Switch id="email-notifications" checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="payment-alerts" className="text-gray-700 font-medium">
                          Payment Alerts
                        </Label>
                        <p className="text-sm text-gray-600">Get notified of new payments</p>
                      </div>
                      <Switch id="payment-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="security-alerts" className="text-gray-700 font-medium">
                          Security Alerts
                        </Label>
                        <p className="text-sm text-gray-600">Important security notifications</p>
                      </div>
                      <Switch id="security-alerts" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-refresh" className="text-gray-700 font-medium">
                          Auto Refresh
                        </Label>
                        <p className="text-sm text-gray-600">Automatically refresh data</p>
                      </div>
                      <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                    </div>
                    <div>
                      <Label htmlFor="currency" className="text-gray-700 font-medium">
                        Display Currency
                      </Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="mt-2 bg-white/50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone" className="text-gray-700 font-medium">
                        Timezone
                      </Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="mt-2 bg-white/50 border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pht">Philippines (PHT)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">Eastern (EST)</SelectItem>
                          <SelectItem value="pst">Pacific (PST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
