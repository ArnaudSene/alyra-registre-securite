'use client'

import './globals.css';
import { Providers } from './providers';
import {ReactNode} from "react";

function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" >
            <body className="h-full bg-gray-900 text-slate-200">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout
