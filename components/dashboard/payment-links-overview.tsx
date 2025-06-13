"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkIcon } from "lucide-react"
import { useEffect, useState } from "react"
import type { Link as LinkType } from "@/lib/db"
import { useUser } from "@civic/auth-web3/react"
import { buildAuthHeaders } from "@/lib/utils"

interface PaymentLinksOverviewProps {
  compact?: boolean
}

export default function PaymentLinksOverview({ compact = false }: PaymentLinksOverviewProps) {
  const { user } = useUser()
  const [links, setLinks] = useState<LinkType[]>([])

  useEffect(() => {
    async function load() {
      if (!user) return
      const res = await fetch("/api/links", { headers: buildAuthHeaders(user) })
      const json = await res.json()
      setLinks(json.links || [])
    }
    load()
  }, [user])

  const totalEarnings = links.reduce((s, l) => s + (l.earnings || 0), 0)

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <LinkIcon className="w-5 h-5 text-blue-600" />
          Payment Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Total Links</span>
          <span className="font-medium">{links.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total Earnings</span>
          <span className="font-medium">
            {totalEarnings > 0
              ? `$${totalEarnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : "—"}
          </span>
        </div>

        {!compact &&
          links.slice(0, 3).map((l) => (
            <div key={l.id} className="flex justify-between text-xs text-gray-600">
              <span className="truncate">{l.name}</span>
              <span>${l.earnings.toFixed(2)}</span>
            </div>
          ))}

        {!compact && links.length > 3 && (
          <p className="text-xs text-gray-500">{links.length - 3}+ more links</p>
        )}
      </CardContent>
    </Card>
  )
}