'use client'

import { createPortal } from "react-dom";
import {useState} from "react";
import {AccountVerifierModalForm} from "@/components/verifier/AccountVerifierModalForm";

export const AccountVerifierButton = () => {

    const [showModal, setShowModal] = useState(false)

    return (
        <div>
            <button
                className="mx-auto box-border rounded bg-zinc-50 text-rose-500 font-bold
                text-xs md:text-base px-1.5 md:px-3.5 h-8 md:h-10"
                onClick={() => setShowModal(true)}>
                Ajoutez un utilisateur
            </button>
            {showModal && createPortal(
                <AccountVerifierModalForm closeModal={() => setShowModal(false)}/>,
                document.body)}
        </div>
    );
};