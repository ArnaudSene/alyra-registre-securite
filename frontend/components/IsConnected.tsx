'use client'

import { getRegisterCreatedEvents, getVerifierCreatedEvents} from "@/utils"
import { useRouter, usePathname } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { useIdentityContext } from "@/contexts/Identity";
import Loader from "./Loader"

const IsConnected = ({ children, asVerifier, asCompany }: {
    children: ReactNode,
    asVerifier?: boolean,
    asCompany?: boolean,
}) => {
    const { address, isConnected } = useAccount()
    const { setCompany, setVerifier } = useIdentityContext()
    const { push } = useRouter()

    const [loading, setLoading] = useState(true)
    const pathName = usePathname()
    const [isCompany, setIsCompany] = useState(false)
    const [isVerifier, setIsVerifier] = useState(false)

    useEffect(() => {
        setLoading(true)
        setCompany(false)
        setIsCompany(false)
        setVerifier(false)
        setIsVerifier(false)

        if (isConnected) {
            if(asCompany) {
                getRegisterCreatedEvents()
                    .then(data => {
                        const index = data.findIndex((d) => d.account === address )
                        if (index !== -1) {
                            setCompany(true)
                            setIsCompany(true)
                        }

                    })
                    .catch(() => push('/'))
                    .finally(() => setLoading(false))
            }
            if (asVerifier) {
                getVerifierCreatedEvents()
                    .then(data => {
                        const index = data.findIndex((d) => d.verifier === address )
                        if (index !== -1) {
                            setVerifier(true)
                            setIsVerifier(true)
                        }

                    })
                    .catch(() => push('/'))
                    .finally(() => setLoading(false))
            }
            else setLoading(false)

        } else if (pathName !== '/') {
            push('/')
        }
        else {
            setLoading(false)
        }

    }, [address, isConnected])

    return (
        <Loader isLoading={loading}>
            {isConnected ? children :
                <div className="flex flex-row">
                    <div className="border-t border-t-rose-500 text-center w-1/2 mt-10 p-5
                    bg-gradient-to-t from-gray-700 to-gray-800 bg-gray-700 rounded mx-auto
                     ">
                        <p>Ho, n'oublies pas de te connecter à ton wallet1</p>

                    </div>
                </div>
            }
        </Loader>
    )
}
export default IsConnected