'use client'

import {useState} from "react";
import { createPortal } from "react-dom";
import {VerifierModalForm} from "@/components/verifier/VerifierModalForm";

export const VerifierButton = () => {

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
                <VerifierModalForm closeModal={() => setShowModal(false)}/>,
                document.body)}
        </>
    );
};