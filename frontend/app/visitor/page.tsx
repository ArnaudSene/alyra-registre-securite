'use client'

import { useState } from "react"
import Loader from "@/components/Loader";
import IsConnected from "@/components/IsConnected";

const VisitorPage = () => {
    const [loading, setLoading] = useState(false)

    return (
        <Loader isLoading={loading}>
            <IsConnected asVerifier={true}>
                <div className="flex flex-row">
                    <div className="border-t border-t-rose-500 text-center w-1/2 mt-10 p-5
                    bg-gradient-to-t from-gray-700 to-gray-800 bg-gray-700 rounded mx-auto
                     ">
                        <p>Ho, cette section n'est pas encore en service on dirait!</p>

                    </div>
                </div>
            </IsConnected>
        </Loader>
  )
}

export default VisitorPage;