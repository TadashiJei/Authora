"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { loadSelectedChain } from "@/lib/utils"
import { useAccount, useWalletClient } from "wagmi"
import { parseEther } from "viem"
import { sendTransactionWithFallback } from "@/lib/solana"

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

  /* ---------- Civic Auth context ---------- */
  const userContext = useUser()
  const { user, signIn } = userContext

  /* ---------- Active chain ---------- */
  const selectedChain = useMemo(() => loadSelectedChain() || "solana", [])
  const isSolana = selectedChain === "solana"

  /* ---------- Solana ---------- */
  const { connection } = useConnection()

  /* ---------- EVM ---------- */
  const { address: evmAddress } = useAccount()
  const { data: walletClient } = useWalletClient()

  /* ---------- Click handler ---------- */
  const handleClick = async () => {
    try {
      setLoading(true)

      // Auth and wallet setup
      if (!user) {
        await signIn()
      }
      if (!userHasWallet(userContext)) {
        await userContext.createWallet()
      }

      // Fetch creator address
      const res = await fetch(
        `/api/wallet/${creatorId}?chain=${isSolana ? "solana" : "ethereum"}`,
      )
      if (!res.ok) {
        toast({ title: "Creator wallet not found" })
        setLoading(false)
        return
      }
      const { address: recipient } = await res.json()

      // Determine amount
      let amt = amount
      if (!amt) {
        const promptLabel = isSolana
          ? "Enter support amount (SOL)"
          : "Enter support amount (ETH)"
        const input = prompt(promptLabel)
        if (!input) {
          setLoading(false)
          return
        }
        amt = Number(input)
      }
      if (!amt || isNaN(amt) || amt <= 0) {
        toast({ title: "Invalid amount" })
        setLoading(false)
        return
      }

      // Execute transfer
      let txHash: string | undefined
      let usedFallback = false

      if (isSolana) {
        if (!userHasWallet(userContext)) {
          toast({ title: "Wallet unavailable" })
          setLoading(false)
          return
        }
        const solCtx = (userContext as unknown as { solana?: { wallet: import("@solana/wallet-adapter-base").SignerWalletAdapter } }).solana
        if (!solCtx?.wallet) {
          toast({ title: "Wallet unavailable" })
          setLoading(false)
          return
        }

        const lamports = Math.round(amt * 1_000_000_000)
        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: solCtx.wallet.publicKey as PublicKey,
            toPubkey: new PublicKey(recipient),
            lamports,
          }),
        )

        const result = await sendTransactionWithFallback(
          solCtx.wallet,
          tx,
          connection,
        )
        txHash = result.signature
        usedFallback = result.usedFallback
      } else {
        if (!walletClient || !evmAddress) {
          toast({ title: "Wallet not connected" })
          setLoading(false)
          return
        }

        txHash = await walletClient.sendTransaction({
          account: evmAddress,
          to: recipient,
          value: parseEther(amt.toString()),
        })
      }

      // Persist payment
      await fetch(`/api/links/${linkId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          currency: currency || (isSolana ? "SOL" : "ETH"),
          txHash,
        }),
      })

      toast({
        title: "Thanks for your support!",
        description: `Transaction ${txHash?.slice(0, 10)}…${
          usedFallback ? " (fallback RPC)" : ""
        }`,
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