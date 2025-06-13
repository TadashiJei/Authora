import { getLink } from "@/lib/db"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CopyButton from "@/components/copy-button"
import { Copy } from "lucide-react"

export default async function PaymentLinkPage({
  params,
}: {
  params: { userId: string; id: string }
}) {
  const link = await getLink(params.userId, params.id)
  if (!link) notFound()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <Card className="bg-white/80 backdrop-blur-xl shadow-2xl w-full max-w-xl">
        <CardContent className="p-8 space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {link.name}
            </h1>
            <p className="text-gray-700">{link.description}</p>
            {link.amount && (
              <p className="text-4xl font-extrabold text-gray-900">
                {link.amount} {link.currency || "USDC"}
              </p>
            )}
          </header>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-transform hover:scale-105"
          >
            Support&nbsp;Creator
          </Button>

          <div className="text-center">
            <CopyButton
              value={link.url}
              variant="ghost"
              size="sm"
              className="mx-auto"
              suffix="Link"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy&nbsp;Link
            </CopyButton>
          </div>

          <p className="text-center text-xs text-gray-500">
            Powered by Authora • Civic&nbsp;Auth&nbsp;Embedded&nbsp;Wallets
          </p>
        </CardContent>
      </Card>
    </div>
  )
}