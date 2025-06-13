"use client"

import { useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useAccount, useDisconnect, useSwitchChain } from "wagmi"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { mainnet } from "viem/chains"

type EvmChain = { id: number; name: string; short: string }
type SolanaChain = { id: "solana"; name: string; short: string }

const EVM_CHAINS: readonly EvmChain[] = [
  { id: mainnet.id, name: "Ethereum", short: "ETH" },
]

const SOLANA_CHAIN: SolanaChain = { id: "solana", name: "Solana", short: "SOL" }

const CHAINS: readonly (EvmChain | SolanaChain)[] = [...EVM_CHAINS, SOLANA_CHAIN]

export default function ChainSelector() {
  const { chain } = useAccount()
  const { switchChain, isPending: switching } = useSwitchChain()
  const { disconnect } = useDisconnect()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const queryChain = searchParams.get("chain")

  const current = useMemo(() => {
    if (queryChain === "solana") return SOLANA_CHAIN
    return EVM_CHAINS.find((c) => c.id === chain?.id) ?? EVM_CHAINS[0]
  }, [chain?.id, queryChain])

  const setQuery = useCallback(
    (val: string | null) => {
      const p = new URLSearchParams(searchParams.toString())
      if (val) p.set("chain", val)
      else p.delete("chain")
      router.replace(`${pathname}?${p.toString()}`)
    },
    [pathname, router, searchParams],
  )

  const handleSelect = (selected: EvmChain | SolanaChain) => {
    if (selected.id === "solana") {
      disconnect()
      setQuery("solana")
      return
    }
    if (queryChain === "solana") setQuery(null)
    if (selected.id !== chain?.id) {
      switchChain({ chainId: selected.id })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          <span className="font-medium truncate">{current.short}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {CHAINS.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onSelect={() => handleSelect(c)}
            disabled={switching || (c.id === current.id && queryChain !== "solana")}
          >
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}