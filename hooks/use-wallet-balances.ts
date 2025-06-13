"use client"

import { useAccount, useBalance } from "wagmi"
import { useEffect, useMemo, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

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
 * Return real‑time wallet balances (native ETH or SOL) for the preferred chain.
 * Pass "solana" to see SOL balances; omit or pass any other value for EVM balances.
 */
export function useWalletBalances(selectedChain?: string | null) {
  /* ----- Ethereum via wagmi ----- */
  const { address: evmAddress } = useAccount()
  const { data: evmBalance } = useBalance({
    address: evmAddress,
    unit: "ether",
    query: {
      enabled: !!evmAddress && selectedChain !== "solana",
      refetchInterval: 30000,
    },
  })

  /* ----- Solana via wallet‑adapter ----- */
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [solLamports, setSolLamports] = useState<bigint | null>(null)

  useEffect(() => {
    let cancelled = false
    async function poll() {
      if (!publicKey || selectedChain === "evm") {
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
  }, [connection, publicKey, selectedChain])

  /* ----- USD prices ----- */
  const [ethUsd, setEthUsd] = useState<number | undefined>()
  const [solUsd, setSolUsd] = useState<number | undefined>()

  useEffect(() => {
    if (evmBalance && ethUsd === undefined && selectedChain !== "solana") {
      fetchUsdPrice(COINGECKO_IDS.ethereum).then(setEthUsd)
    }
  }, [evmBalance, ethUsd, selectedChain])

  useEffect(() => {
    if (publicKey && solUsd === undefined && selectedChain === "solana") {
      fetchUsdPrice(COINGECKO_IDS.solana).then(setSolUsd)
    }
  }, [publicKey, solUsd, selectedChain])

  /* ----- Assemble result ----- */
  const balances = useMemo<WalletBalance[]>(() => {
    const list: WalletBalance[] = []
    if (selectedChain === "solana") {
      if (publicKey && solLamports !== null) {
        const sol = Number(solLamports) / 1_000_000_000
        list.push({
          symbol: "SOL",
          formatted: sol.toLocaleString(undefined, { maximumFractionDigits: 6 }),
          valueUsd: solUsd !== undefined ? sol * solUsd : undefined,
        })
      }
    } else {
      if (evmBalance) {
        list.push({
          symbol: evmBalance.symbol,
          formatted: evmBalance.formatted,
          valueUsd:
            ethUsd !== undefined ? Number(evmBalance.formatted) * ethUsd : undefined,
        })
      }
    }
    return list
  }, [evmBalance, publicKey, solLamports, ethUsd, solUsd, selectedChain])

  const totalUsd = balances.reduce((s, b) => s + (b.valueUsd || 0), 0)

  const address =
    selectedChain === "solana"
      ? publicKey?.toString()
      : evmAddress || publicKey?.toString()

  return {
    address,
    balances,
    totalUsd,
  }
}