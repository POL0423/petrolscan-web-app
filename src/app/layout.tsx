/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/layout.tsx
 * Description: Main homepage layout.
 ***************************************************************/

import type { Metadata } from "next";
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export const metadata: Metadata = {
    title: {
        default: "PetrolScan",
        template: "%s | PetrolScan",
    },
    description: "A web application for comparing fuel prices",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="cs">
            <body
                className={`${inter.className} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
