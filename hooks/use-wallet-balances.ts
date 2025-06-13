"use client"

import { useAccount, useBalance } from "wagmi"
import { useEffect, useMemo, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

/** A single wallet balance row. */
export interface WalletBalance {
  symbol: string
  formatted: string
  valueUsd?: number
}

/* ---------- Helpers ---------- */

const COINGECKO_IDS: Record<string, string> = {
  ethereum: "ethereum",
  solana: "solana",
}

async function fetchUsdPrice(id: string): Promise<number | undefined> {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
    )
    const json = await res.json()
    return json[id]?.usd
  } catch {
    return undefined
  }
}

/* ---------- Hook ---------- */

/**
 * Return real‑time wallet balances (native ETH/SOL) and their USD value.
 * Works for embedded Civic wallets on both Ethereum and Solana.
 */
export function useWalletBalances() {
  /* ----- Ethereum via wagmi ----- */
  const { address: evmAddress, chain: evmChain } = useAccount()
  const { data: evmBalance } = useBalance({
    address: evmAddress,
    watch: true,
    formatUnits: "ether",
    enabled: !!evmAddress,
  })

  /* ----- Solana via wallet‑adapter ----- */
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [solLamports, setSolLamports] = useState<bigint | null>(null)

  useEffect(() => {
    let cancelled = false
    async function poll() {
      if (!publicKey) {
        setSolLamports(null)
        return
      }
      const lamports = await connection.getBalance(publicKey, {
        commitment: "confirmed",
      })
      if (!cancelled) setSolLamports(BigInt(lamports))
    }
    poll()
    const id = setInterval(poll, 30000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [connection, publicKey])

  /* ----- USD prices ----- */
  const [ethUsd, setEthUsd] = useState<number | undefined>()
  const [solUsd, setSolUsd] = useState<number | undefined>()

  useEffect(() => {
    if (evmBalance && ethUsd === undefined) {
      fetchUsdPrice(COINGECKO_IDS.ethereum).then(setEthUsd)
    }
  }, [evmBalance, ethUsd])

  useEffect(() => {
    if (publicKey && solUsd === undefined) {
      fetchUsdPrice(COINGECKO_IDS.solana).then(setSolUsd)
    }
  }, [publicKey, solUsd])

  /* ----- Assemble result ----- */
  const balances = useMemo<WalletBalance[]>(() => {
    const list: WalletBalance[] = []
    if (evmBalance) {
      list.push({
        symbol: evmBalance.symbol,
        formatted: evmBalance.formatted,
        valueUsd:
          ethUsd !== undefined ? Number(evmBalance.formatted) * ethUsd : undefined,
      })
    }
    if (publicKey && solLamports !== null) {
      const sol = Number(solLamports) / 1_000_000_000
      list.push({
        symbol: "SOL",
        formatted: sol.toLocaleString(undefined, { maximumFractionDigits: 6 }),
        valueUsd: solUsd !== undefined ? sol * solUsd : undefined,
      })
    }
    return list
  }, [evmBalance, publicKey, solLamports, ethUsd, solUsd])

  const totalUsd = balances.reduce((s, b) => s + (b.valueUsd || 0), 0)

  return {
    address: evmAddress || publicKey?.toString(),
    balances,
    totalUsd,
  }
}