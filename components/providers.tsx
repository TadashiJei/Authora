'use client'

import { ReactNode, useMemo } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider, createConfig } from "wagmi"
import { embeddedWallet, useAutoConnect } from "@civic/auth-web3/wagmi"
import { http } from "viem"
import { mainnet } from "viem/chains"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { CivicAuthProvider } from "@civic/auth-web3/react"
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

/* ---------- Auto‑connect helper (must live inside providers) ---------- */

function AutoConnect() {
  // Automatically creates & connects the embedded wallet when possible.
  useAutoConnect()
  return null
}

/* ---------- Redirect URL helper ---------- */

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