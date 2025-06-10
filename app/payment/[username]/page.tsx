"use client"

import { useState } from "react"
import { ArrowRight, Copy, QrCode, Shield, Star, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentPage({ params }: { params: { username: string } }) {
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState("USDC")
  const [message, setMessage] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-4xl text-white font-bold">{params.username[0].toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 shadow-lg">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">@{params.username}</h1>
                <p className="text-xl text-gray-600 mb-4">Digital Creator & Freelancer</p>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">
                  Welcome to my payment page! I'm a digital creator specializing in Web3 design and development. Send me
                  crypto payments securely through Authora's verified platform.
                </p>

                {/* Social Links */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Portfolio
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Reviews
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Payment</h2>

              <div className="space-y-6">
                {/* Amount Input */}
                <div>
                  <Label htmlFor="amount" className="text-gray-700 font-medium mb-2 block">
                    Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-2xl font-bold bg-white/20 border-white/30 focus:border-purple-500 focus:ring-purple-500 pr-20"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <span className="text-gray-600 font-medium">{token}</span>
                    </div>
                  </div>
                </div>

                {/* Token Selection */}
                <div>
                  <Label htmlFor="token" className="text-gray-700 font-medium mb-2 block">
                    Token
                  </Label>
                  <Select value={token} onValueChange={setToken}>
                    <SelectTrigger className="bg-white/20 border-white/30 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                      <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                      <SelectItem value="SOL">SOL - Solana</SelectItem>
                      <SelectItem value="MATIC">MATIC - Polygon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium mb-2 block">
                    Message (Optional)
                  </Label>
                  <Input
                    id="message"
                    placeholder="Thanks for the great work!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-white/20 border-white/30 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {/* Send Button */}
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg py-6"
                  disabled={!amount}
                >
                  Send {amount} {token}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                      <p className="text-sm text-blue-700">
                        This payment is secured by Civic Auth and processed through Authora's verified network.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code & Wallet Info */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Scan to Pay</h3>

                {/* QR Code Placeholder */}
                <div className="w-48 h-48 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>

                <p className="text-gray-600 mb-4">Scan this QR code with your crypto wallet to send payment directly</p>

                <Button variant="outline" className="bg-white/20 border-white/30 text-gray-700 hover:bg-white/30">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Wallet Address
                </Button>
              </CardContent>
            </Card>

            {/* Wallet Address */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Wallet Address</h4>
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <p className="font-mono text-sm text-gray-800 break-all">
                    0x742d35Cc6634C0532925a3b8D4C0532925a3b8f3a
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Accepted Tokens */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Accepted Tokens</h4>
                <div className="space-y-3">
                  {[
                    { symbol: "USDC", name: "USD Coin", network: "Ethereum" },
                    { symbol: "ETH", name: "Ethereum", network: "Ethereum" },
                    { symbol: "SOL", name: "Solana", network: "Solana" },
                    { symbol: "MATIC", name: "Polygon", network: "Polygon" },
                  ].map((token, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{token.symbol[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{token.symbol}</p>
                          <p className="text-xs text-gray-600">{token.name}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs bg-white/20 border-white/30">
                        {token.network}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
