'use client'

import { useState } from "react"
import Loader from "@/components/Loader";
import {VerifierRootPage} from "@/components/verifier/VerifierRootPage";
import IsConnected from "@/components/IsConnected";

const VerifierPage = () => {
    const [loading, setLoading] = useState(false)

    return (
        <Loader isLoading={loading}>
            <VerifierRootPage />
        </Loader>
  )
}

export default VerifierPage;