'use client'

import { useState } from "react"
import Loader from "@/components/Loader";
import IsConnected from "@/components/IsConnected";

const VisitorPage = () => {
    const [loading, setLoading] = useState(false)

    return (
        <Loader isLoading={loading}>
            <IsConnected asVerifier={true}>
                <>not visitor page yet</>
            </IsConnected>
        </Loader>
  )
}

export default VisitorPage;