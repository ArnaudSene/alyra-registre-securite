'use client'

import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, Theme, darkTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { argentWallet, ledgerWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { hardhat, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import merge from 'lodash.merge';
import {IdentityContextProvider} from "@/contexts/Identity";
import {ReactNode, useEffect, useState} from "react";
import Headers from "@/components/headers/headers";
import Footer from "@/components/footers/footer";
import IsConnected from "@/components/IsConnected";


const customTheme = merge(darkTheme({
    borderRadius: 'small',
    overlayBlur: 'small',
    fontStack: 'system',
}), {

    colors: {
        accentColor: '#f43f5e',
        accentColorForeground: '#111827',
        modalBackground: '#111827',
        generalBorder: '#f43f5e',
    },
} as Theme);


const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        sepolia,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [hardhat] : []),
    ],
    [publicProvider()]
);


const projectId: string = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

const { wallets } = getDefaultWallets({
    appName: 'RainbowKit Security Register',
    projectId: projectId,
    chains,
});

const AppInfo = {
    appName: 'Security Register RS+',
};

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Other',
        wallets: [
            argentWallet({ projectId, chains }),
            trustWallet({ projectId, chains }),
            ledgerWallet({ projectId, chains }),
        ],
    },
]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

export function Providers({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const theme = extendTheme({
        colors: {
            brand: {
                500: "#6366f1",
                600: "#4844bb",
                700: "#312e81"
            },
        },
    })

    return (
        <div>
            <ChakraProvider theme={theme}>
                <WagmiConfig config={wagmiConfig}>
                    <RainbowKitProvider chains={chains} appInfo={AppInfo} theme={customTheme}>
                        <IdentityContextProvider>
                            <div className="min-h-screen flex flex-col">

                                <Headers />

                                    <IsConnected asCompany={true} asVerifier={true}>

                                        {mounted && children}

                                    </IsConnected >

                                    <div className="my-10"></div>
                                <Footer />
                            </div>
                        </IdentityContextProvider>
                    </RainbowKitProvider>
                </WagmiConfig>
            </ChakraProvider>
        </div>
    );
}