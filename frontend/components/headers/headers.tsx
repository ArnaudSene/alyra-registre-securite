'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { AppLogo } from "../AppLogo"

const Headers = () => {
    const { isConnected } = useAccount()

    return (
        <header className="bg-gray-950 text-gray-100 border-gray-500 border-b">
            <nav className="flex flex-col md:flex-row mx-auto justify-between text-center p-4">

            <AppLogo />

                {/*Subscribe*/}
                {
                    <div className="w-1/2 mx-auto text-center md:text-right">
                    </div>
                }
                
                {isConnected? (
                    <div className="mx-auto">
                        <ConnectButton
                            accountStatus='avatar'
                            chainStatus="none"
                            showBalance={false}
                        />
                    </div>
                    ) :(
                    <div className="mx-auto">
                        <ConnectButton />
                    </div>
                )}
            </nav>
        </header>
    )
}
export default Headers;