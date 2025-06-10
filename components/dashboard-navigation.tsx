"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Settings,
  LogOut,
  Sparkles,
  Shield,
  ChevronDown,
  Menu,
  X,
  Home,
  Wallet,
  LinkIcon,
  BarChart3,
  HelpCircle,
  DollarSign,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

export default function DashboardNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "payment",
      title: "Payment Received",
      message: "You received $299 USDC from 0x1234...5678",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "security",
      title: "New Login Detected",
      message: "Someone signed in from Chrome on Windows",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "system",
      title: "Link Performance",
      message: "Your Premium Course link has 15% conversion rate",
      time: "3 hours ago",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="w-4 h-4 text-green-600" />
      case "security":
        return <Shield className="w-4 h-4 text-orange-600" />
      case "system":
        return <BarChart3 className="w-4 h-4 text-blue-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Authora
            </span>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              Dashboard
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium relative group"
            >
              <Home className="w-4 h-4" />
              <span>Overview</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/dashboard/wallet"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium relative group"
            >
              <Wallet className="w-4 h-4" />
              <span>Wallet</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/dashboard/links"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium relative group"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Links</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors font-medium relative group"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-gray-700 hover:text-purple-600">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{unreadCount}</span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{notification.title}</p>
                            {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Help */}
            <Link href="/dashboard/help">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-purple-600">
                <HelpCircle className="w-5 h-5" />
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                      C
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">Creator</p>
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">Verified</span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">@creator</p>
                    <p className="text-xs text-gray-500">creator@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/security">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/help">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/wallet"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                <Wallet className="w-5 h-5" />
                <span>Wallet</span>
              </Link>
              <Link
                href="/dashboard/links"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                <LinkIcon className="w-5 h-5" />
                <span>Payment Links</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </Link>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                      C
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">@creator</p>
                    <div className="flex items-center">
                      <Shield className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">Civic Verified</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/dashboard/settings">
                    <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Link href="/dashboard/help">
                    <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
