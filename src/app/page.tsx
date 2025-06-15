/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/page.tsx
 * Description: Main homepage content.
 ***************************************************************/

import Image from "next/image";
import { merriweather } from "./ui/fonts";
import LocationSearch from "./ui/location-search";
import Header from "./ui/header";
import { Suspense } from "react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col p-6">
            <Header />
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                    <p className={`${merriweather.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
                        <strong>Vítejte v aplikaci PetrolScan.</strong> Jedná se o webovou aplikaci, která vám pomůže najít nejlepší ceny paliva ve vašem okolí. Stačí zadat svou polohu a my vám ukážeme nejbližší čerpací stanice s aktuálními cenami paliva.
                    </p>
                    <Suspense>
                        <LocationSearch />
                    </Suspense>
                </div>
                <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                    <Image
                        src="/hero-desktop.png"
                        width={1000}
                        height={760}
                        className="hidden md:block"
                        alt="Screenshots of the dashboard project showing desktop version"
                    />
                    <Image
                        src="/hero-mobile.png"
                        width={560}
                        height={620}
                        className="block md:hidden"
                        alt="Screenshots of the dashboard project showing mobile version"
                    />
                </div>
            </div>
        </main>
    );
}
