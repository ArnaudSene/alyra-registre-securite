'use client'

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import {Company} from "@/components/company/Company";
import {Verifier} from "@/components/verifier/Verifier";
import Loader from "@/components/Loader";

const Subscription = () => {
    const { address, isConnected } = useAccount()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [address, isConnected])

    return (
        <Loader isLoading={loading}>
            <div className="py-10">
                <div className="flex flex-col md:flex-row">
                    <Company />
                    <Verifier />
                </div>
            </div>
        </Loader>
  )
}

export default Subscription;