"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

interface SupportCreatorButtonProps {
  linkId: string
  creatorId: string
  amount?: number
  currency?: string
}

export default function SupportCreatorButton({
  linkId,
  creatorId,
  amount,
  currency = "SOL",
}: SupportCreatorButtonProps) {
  const [loading, setLoading] = useState(false)
  const { user, signIn } = useUser()
  const userContext = useUser()
  const { connection } = useConnection()

  const handleClick = async () => {
    try {
      setLoading(true)

      if (!user) {
        await signIn()
      }

      if (!userHasWallet(userContext)) {
        await userContext.createWallet()
      }

      const wallet = userContext.solana?.wallet
      if (!wallet) {
        toast({ title: "Wallet unavailable" })
        return
      }

      const res = await fetch(`/api/wallet/${creatorId}`)
      if (!res.ok) {
        toast({ title: "Creator wallet not found" })
        return
      }
      const { address: recipient } = await res.json()

      let amt = amount
      if (!amt) {
        const input = prompt("Enter support amount (SOL)")
        if (!input) {
          setLoading(false)
          return
        }
        amt = Number(input)
        if (isNaN(amt) || amt <= 0) {
          toast({ title: "Invalid amount" })
          setLoading(false)
          return
        }
      }

      const lamports = Math.round(amt * 1_000_000_000)
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports,
        }),
      )
      const sig = await wallet.sendTransaction(tx, connection)
      await connection.confirmTransaction(sig, "confirmed")

      await fetch(`/api/links/${linkId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, currency, txHash: sig }),
      })

      toast({
        title: "Thanks for your support!",
        description: `Transaction ${sig.slice(0, 10)}…`,
      })
    } catch (err) {
      console.error(err)
      toast({ title: "Payment failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="lg"
      disabled={loading}
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-transform hover:scale-105 text-lg"
    >
      {loading ? "Processing…" : "Support Creator"}
    </Button>
  )
}