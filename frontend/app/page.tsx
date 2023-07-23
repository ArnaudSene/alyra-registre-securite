'use client'

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { useIdentityContext } from "@/contexts/Identity";
import Link from "next/link";
import Loader from "@/components/Loader"

const Home = () => {
    const { address, isConnected } = useAccount()
    const { company, verifier, setCompany, setVerifier } = useIdentityContext()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log("/page company?: " + company)
        console.log("/page verifier?: " + verifier)
        setLoading(false)
    }, [address, isConnected])

    return (
        <div>
            <div className="text-sm md:text-base flex flex-col md:flex-row m-4 text-center md:h-72">

                <Loader isLoading={loading}>
                    {company &&
                        <div className="text-xs md:text-base md:basis-1/2 h-40 md:h-full m-2 px-0.5 hover:bg-cyan-300 rounded shadow-2xl">
                            <Link href="/company">
                                <button className="w-full h-full bg-gradient-to-t from-gray-800 to-gray-900 text-zinc-50 shadow-lg drop-shadow-lg">
                                    <div className="">
                                        <h1 className="font-bold pb-2 hover:text-cyan-300 ">Espace membre</h1>
                                        <p className="text-rose-500 pb-2">Compagnies</p>
                                        <p>Accédez à la gestion de votre registre de sécurité </p>

                                    </div>
                                </button>
                            </Link>
                        </div>
                    }
                    {verifier &&
                        <div className="text-xs md:text-base md:basis-1/2 h-40 md:h-full m-2 px-0.5 hover:bg-cyan-300 rounded shadow-2xl">
                            <Link href="/verifier">
                                <button className="w-full h-full bg-gradient-to-t from-gray-800 to-gray-900 text-zinc-50 shadow-lg drop-shadow-lg">
                                    <div className="">
                                        <h1 className="font-bold pb-2 hover:text-cyan-300 ">Espace membre</h1>
                                        <p className="text-rose-500 pb-2">Compagnies VGP agréées</p>
                                        <p>Accédez aux vérifications de registre de sécurité en cours</p>
                                    </div>
                                </button>
                            </Link>
                        </div>
                    }
                    {
                        <div className="text-xs md:text-base md:basis-1/2 h-40 md:h-full m-2 px-0.5 hover:bg-cyan-300 rounded shadow-2xl">
                            <Link href="/visitor">
                                <button className="w-full h-full bg-gradient-to-t from-gray-800 to-gray-900 text-zinc-50 shadow-lg drop-shadow-lg">
                                    <div>
                                        <h1 className="font-bold pb-2 hover:text-cyan-300 ">Visiteurs</h1>
                                        <p className="text-rose-500 pb-2">Consultez les registres de sécurité des compagnies</p>

                                        <p className="py-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                 stroke="currentColor"
                                                 className="w-3 h-3 md:w-4 md:h-4 inline mr-2 text-cyan-400">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                            </svg>Inspection du travail

                                        </p>
                                        <p className="py-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                 stroke="currentColor"
                                                 className="w-3 h-3 md:w-4 md:h-4 inline mr-2 text-cyan-400">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                            </svg>Assureurs
                                        </p>

                                    </div>
                                </button>
                            </Link>
                        </div>
                    }
                    {
                        <div className="text-xs md:text-base md:basis-1/2 h-40 md:h-full m-2 px-0.5 hover:bg-cyan-300 rounded shadow-2xl">
                            <Link href="/subscription">
                                <button className="w-full h-full bg-gradient-to-t from-gray-800 to-gray-900 text-zinc-50 shadow-lg drop-shadow-lg">
                                    <div>
                                        <h1 className="font-bold pb-2 hover:text-cyan-300 ">Créez votre compte</h1>

                                        <p className="py-1">
                                            <p className="text-rose-500">Pour les compagnies</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                 stroke="currentColor"
                                                 className="w-3 h-3 md:w-4 md:h-4 inline mr-2 text-cyan-400">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                            </svg>
                                            Gérez vos registres de sécurité en toute facilité
                                        </p>
                                        <p className="py-1">
                                            <p className="text-rose-500">Pour les compagnies VGP agréées</p>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                 stroke="currentColor"
                                                 className="w-3 h-3 md:w-4 md:h-4 inline mr-2 text-cyan-400">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                                            </svg>Gérez les vérifications de vos clients
                                        </p>

                                    </div>
                                </button>
                            </Link>
                        </div>
                    }
                </Loader>
            </div>
        </div>
    )
}

export default Home;