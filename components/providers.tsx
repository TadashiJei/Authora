'use client'

import { ReactNode, useMemo, useEffect, useRef } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig, useAccount } from "wagmi"
import { embeddedWallet, useAutoConnect } from "@civic/auth-web3/wagmi"
import { http } from "viem"
import { mainnet } from "viem/chains"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { CivicAuthProvider, useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [embeddedWallet()],
})

const SOLANA_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ||
  "https://api.mainnet-beta.solana.com"
const CIVIC_CLIENT_ID = process.env.NEXT_PUBLIC_CIVIC_AUTH_CLIENT_ID || ""

/* ---------- Auto‑connect helper ---------- */

function AutoConnect() {
  // EVM auto‑connect
  useAutoConnect()

  const userContext = useUser()
  const { address: evmAddress } = useAccount()

  /* Create Solana wallet if missing */
  useEffect(() => {
    if (!userContext.user) return
    if (!userHasWallet(userContext) && !(userContext as any).walletCreationInProgress) {
      userContext.createWallet().catch((err: unknown) =>
        console.error("Failed to create Civic Solana wallet", err),
      )
    }
  }, [userContext])

  /* Register wallets */
  const lastRegistered = useRef<{ solana?: string; ethereum?: string }>({})
  useEffect(() => {
    if (!userContext.user || !userHasWallet(userContext)) return

    const headers = {
      "Content-Type": "application/json",
      "x-user-id": userContext.user.id || userContext.user.email || "",
    }

    // Solana
    const solAddr = userContext.solana?.address
    if (solAddr && lastRegistered.current.solana !== solAddr) {
      lastRegistered.current.solana = solAddr
      fetch("/api/wallet/register", {
        method: "POST",
        headers,
        body: JSON.stringify({ address: solAddr, chain: "solana" }),
      }).catch(() => {})
    }

    // Ethereum
    if (evmAddress && lastRegistered.current.ethereum !== evmAddress) {
      lastRegistered.current.ethereum = evmAddress
      fetch("/api/wallet/register", {
        method: "POST",
        headers,
        body: JSON.stringify({ address: evmAddress, chain: "ethereum" }),
      }).catch(() => {})
    }
  }, [userContext, evmAddress])

  return null
}

/* ---------- Helper to compute redirect URL ---------- */

function useRedirectUrl() {
  return useMemo(() => {
    if (process.env.NEXT_PUBLIC_CIVIC_AUTH_REDIRECT_URI) {
      return process.env.NEXT_PUBLIC_CIVIC_AUTH_REDIRECT_URI
    }
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return undefined
  }, [])
}

export default function Providers({ children }: { children: ReactNode }) {
  const redirectUrl = useRedirectUrl()

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectionProvider endpoint={SOLANA_RPC}>
          <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <CivicAuthProvider
                clientId={CIVIC_CLIENT_ID}
                initialChain={mainnet}
                redirectUrl={redirectUrl}
                chains={[mainnet]}
              >
                <AutoConnect />
                {children}
                <Toaster richColors position="top-right" />
              </CivicAuthProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}