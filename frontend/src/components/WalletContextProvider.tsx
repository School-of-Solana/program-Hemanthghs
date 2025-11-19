'use client'

import React, { ReactNode, useMemo } from 'react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletMultiButton, WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-950 text-gray-200">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 shadow-lg px-5 py-4">
              <div className="flex justify-between items-center max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-white">Blog DApp</h1>

                {/* Solana Wallet Button */}
                <div className=" rounded-xl">
                  <WalletMultiButton />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="p-6 max-w-6xl mx-auto">{children}</main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider
