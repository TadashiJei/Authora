'use client'

import { useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useAccount, useDisconnect, useSwitchChain } from "wagmi"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { mainnet } from "viem/chains"
import {
  SELECTED_CHAIN_KEY,
  saveSelectedChain,
  loadSelectedChain,
} from "@/lib/utils"

type EvmChain = { id: number; name: string; short: string }
type SolanaChain = { id: "solana"; name: string; short: string }

const EVM_CHAINS: readonly EvmChain[] = [
  { id: mainnet.id, name: "Ethereum", short: "ETH" },
]

const SOLANA_CHAIN: SolanaChain = {
  id: "solana",
  name: "Solana",
  short: "SOL",
}

const CHAINS: readonly (EvmChain | SolanaChain)[] = [
  ...EVM_CHAINS,
  SOLANA_CHAIN,
]

/** Dispatch a global custom event when the active chain changes. */
function broadcastChain(val: string) {
  try {
    window.dispatchEvent(
      new CustomEvent("authora.chainChanged", { detail: val }),
    )
  } catch {}
}

export default function ChainSelector() {
  const { chain } = useAccount()
  const { switchChain, isPending: switching } = useSwitchChain()
  const { disconnect } = useDisconnect()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  /* ---------- Determine current chain ---------- */
  const queryChain = searchParams.get("chain") ?? loadSelectedChain()

  const current = useMemo(() => {
    if (queryChain === "solana") return SOLANA_CHAIN
    return EVM_CHAINS.find((c) => c.id === chain?.id) ?? EVM_CHAINS[0]
  }, [chain?.id, queryChain])

  /* ---------- Helpers ---------- */
  const setQuery = useCallback(
    (val: string | null) => {
      const p = new URLSearchParams(searchParams.toString())
      if (val) p.set("chain", val)
      else p.delete("chain")
      router.replace(`${pathname}?${p.toString()}`)

      if (val !== null) {
        saveSelectedChain(val)
        broadcastChain(val)
      } else {
        saveSelectedChain("ethereum")
        broadcastChain("ethereum")
      }
    },
    [pathname, router, searchParams],
  )

  /* ---------- Handle selection ---------- */
  const handleSelect = (selected: EvmChain | SolanaChain) => {
    if (selected.id === "solana") {
      disconnect()
      setQuery("solana")
      return
    }
    if (selected.id !== chain?.id) {
      switchChain({ chainId: selected.id })
    }
    setQuery(null)
  }

  /* ---------- Sync localStorage and URL on mount ---------- */
  useEffect(() => {
    if (queryChain && !searchParams.get("chain") && queryChain !== "solana") {
      return
    }
    if (!queryChain && searchParams.get("chain") === "solana") {
      saveSelectedChain("solana")
      broadcastChain("solana")
    }
  }, [queryChain, searchParams])

  /* ---------- UI ---------- */
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
        >
          <span className="font-medium truncate">{current.short}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {CHAINS.map((c) => (
          <DropdownMenuItem
            key={String(c.id)}
            onSelect={() => handleSelect(c)}
            disabled={switching || c.id === current.id}
            className="cursor-pointer data-[disabled]:opacity-50"
          >
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}