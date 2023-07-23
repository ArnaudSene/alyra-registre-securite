'use client'

import {useState} from "react";
import { createPortal } from "react-dom";
import { CompanyModalForm } from "@/components/company/CompanyModalForm";

export const CompanyButton = () => {

    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <button
                className="mx-auto py-2 px-3.5 box-border h-10 rounded bg-zinc-50 text-rose-500
                                    font-bold hover:px-4"
                onClick={() => setShowModal(true)}
            >
                Inscription
            </button>
            {showModal && createPortal(
                <CompanyModalForm closeModal={() => setShowModal(false)}/>,
                document.body)}
        </>
    );
};