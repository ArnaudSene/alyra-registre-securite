'use client'

import {CompanyButton} from "@/components/company/CompanyButton";
import {useAccount} from "wagmi";
import {useEffect} from "react";

export const Company = () => {
    const { address, isConnected } = useAccount()

    useEffect(() => {

    }, [isConnected, address])

    return (
        <div className="text-sm md:text-base md:basis-1/2 mx-12 rounded h-auto text-center mb-2
                    bg-gradient-to-t from-gray-800 to-gray-900 text-zinc-50 shadow-lg drop-shadow-lg
                    border-gray-800 border"
        >
            <div className="py-3 px-1 bg-rose-500">
                <h1 className="text-base md:text-lg font-bold text-zinc-50">Vous êtes une compagnie?</h1>
            </div>

            <div className="p-5">
                <ul className="text-left">
                    <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="w-3 h-3 md:w-5 md:h-5 inline mr-2 text-cyan-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg><span>Besoin de registres de sécurités</span>
                    </li>
                    <li ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="w-3 h-3 md:w-5 md:h-5 inline mr-2 text-cyan-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                        </svg>Registres digitalisés et décentralisés
                    </li>
                    <li ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                              stroke="currentColor" className="w-3 h-3 md:w-5 md:h-5 inline mr-2 text-cyan-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>Donnez de la valeur à votre entreprise
                    </li>
                </ul>
            </div>

            <div className="flex flex-col md:flex-row pb-5">
                <CompanyButton />
            </div>
        </div>
    );
};