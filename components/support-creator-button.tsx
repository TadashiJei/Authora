"use client"

import { useState, startTransition, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { loadSelectedChain } from "@/lib/utils"
import { useAccount, useWalletClient, usePublicClient } from "wagmi"
import { parseEther } from "viem"
import { sendTransactionWithFallback } from "@/lib/solana"
import { useWalletBalances } from "@/hooks/use-wallet-balances"

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

  /* ---------- Global chain context ---------- */
  const selectedChain = loadSelectedChain() || "solana"
  const isSolana = selectedChain === "solana"

  /* ---------- Civic Auth context ---------- */
  const userContext = useUser()
  const { user, signIn } = userContext

  /* ---------- Wallet balance ---------- */
  const { balances } = useWalletBalances(selectedChain)
  const balanceInfo = useMemo(
    () =>
      balances.find((b) =>
        isSolana ? b.symbol === "SOL" : b.symbol.toUpperCase() === "ETH",
      ),
    [balances, isSolana],
  )
  const formattedBalance = balanceInfo
    ? `${balanceInfo.formatted} ${balanceInfo.symbol}`
    : "—"

  /* ---------- Solana ---------- */
  const { connection } = useConnection()

  /* ---------- EVM ---------- */
  const { address: evmAddress } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  /* ---------- Click handler ---------- */
  const handleClick = async () => {
    if (loading) return

    try {
      // Ensure user is authenticated
      if (!user) {
        await signIn()
      }

      // Ensure embedded wallet exists
      if (!userHasWallet(userContext)) {
        await userContext.createWallet()
      }

      startTransition(() => setLoading(true))

      /* ---------- Fetch creator address ---------- */
      const res = await fetch(
        `/api/wallet/${creatorId}?chain=${isSolana ? "solana" : "ethereum"}`,
      )
      if (!res.ok) {
        toast({ title: "Creator wallet not found" })
        startTransition(() => setLoading(false))
        return
      }
      const { address: recipient } = await res.json()

      /* ---------- Determine amount ---------- */
      let amt = amount
      if (!amt) {
        const promptLabel = isSolana
          ? "Enter support amount (SOL)"
          : "Enter support amount (ETH)"
        const input = prompt(promptLabel)
        if (!input) {
          startTransition(() => setLoading(false))
          return
        }
        amt = Number(input)
      }
      if (!amt || isNaN(amt) || amt <= 0) {
        toast({ title: "Invalid amount" })
        startTransition(() => setLoading(false))
        return
      }

      /* ---------- Balance check ---------- */
      if (isSolana) {
        const solCtx = (userContext as unknown as {
          solana?: {
            wallet: import("@solana/wallet-adapter-base").SignerWalletAdapter
          }
        }).solana
        if (!solCtx?.wallet) {
          toast({ title: "Wallet unavailable" })
          startTransition(() => setLoading(false))
          return
        }

        const lamportsNeeded = Math.round(amt * 1_000_000_000)
        const balanceLamports = await connection.getBalance(
          solCtx.wallet.publicKey as PublicKey,
        )
        if (balanceLamports < lamportsNeeded) {
          toast({ title: "Insufficient balance" })
          startTransition(() => setLoading(false))
          return
        }

        /* ---------- Transfer ---------- */
        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: solCtx.wallet.publicKey as PublicKey,
            toPubkey: new PublicKey(recipient),
            lamports: lamportsNeeded,
          }),
        )
        const { signature, usedFallback } = await sendTransactionWithFallback(
          solCtx.wallet,
          tx,
          connection,
        )

        await recordPaymentAndToast(
          amt,
          currency || "SOL",
          signature,
          usedFallback,
        )
      } else {
        if (!publicClient || !walletClient || !evmAddress) {
          toast({ title: "Wallet not connected" })
          startTransition(() => setLoading(false))
          return
        }

        const balanceWei = await publicClient.getBalance({ address: evmAddress })
        const requiredWei = parseEther(amt.toString())
        if (balanceWei < requiredWei) {
          toast({ title: "Insufficient balance" })
          startTransition(() => setLoading(false))
          return
        }

        const txHash = await walletClient.sendTransaction({
          account: evmAddress,
          to: recipient,
          value: requiredWei,
        })

        await recordPaymentAndToast(amt, currency || "ETH", txHash, false)
      }
    } catch (err) {
      console.error(err)
      toast({ title: "Payment failed" })
    } finally {
      startTransition(() => setLoading(false))
    }
  }

  /* ---------- Helper ---------- */
  async function recordPaymentAndToast(
    amt: number,
    curr: string,
    txHash: string,
    usedFallback: boolean,
  ) {
    await fetch(`/api/links/${linkId}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amt,
        currency: curr,
        txHash,
      }),
    })

    toast({
      title: "Thanks for your support!",
      description: `Transaction ${txHash.slice(0, 10)}…${
        usedFallback ? " (fallback RPC)" : ""
      }`,
    })
  }

  /* ---------- UI ---------- */
  return (
    <>
      <Button
        size="lg"
        disabled={loading}
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-transform hover:scale-105 text-lg"
      >
        {loading ? "Processing…" : "Support Creator"}
      </Button>
      <p className="text-center text-sm mt-2 text-gray-600">
        Your balance: {formattedBalance}
      </p>
    </>
  )
}