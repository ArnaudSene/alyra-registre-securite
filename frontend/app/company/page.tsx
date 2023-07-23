'use client'

import { useState } from "react"
import Loader from "@/components/Loader"
import {CompanyRootPage} from "@/components/company/CompanyRootPage";
import IsConnected from "@/components/IsConnected";
import {useIdentityContext} from "@/contexts/Identity";

const CompanyPage = () => {
    const { company, verifier } = useIdentityContext()
    const [loading] = useState(false)

    return (
        <Loader isLoading={loading}>
            <CompanyRootPage />
        </Loader>
  )
}

export default CompanyPage;