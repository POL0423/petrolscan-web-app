/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/search/page.tsx
 * Description: Main homepage content.
 ***************************************************************/

import { merriweather } from "@/app/ui/fonts";
import LocationSearch from "@/app/ui/location-search";
import OSMData from "@/app/lib/types/OSMData";
import SearchResults from "../ui/search/results";
import Header from "../ui/header";

export default async function Page(props: {
    searchParams?: Promise<{
        location?: string;
        radius?: string;
        sort?: string;
        fuel_type?: string;
        fuel_quality?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const location = searchParams?.location || '';
    const radius = searchParams?.radius || '10';
    const sort = searchParams?.sort || 'cheapest';
    const fuelType = searchParams?.fuel_type || 'all';
    const fuelQuality = searchParams?.fuel_quality || 'all';

    if (!location) {
        return (
            <main className="flex min-h-screen flex-col p-6">
                <Header />
                <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                    <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                        <p className={`${merriweather.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
                            <strong>PetrolScan srovnávač</strong>
                        </p>
                        <p className={`${merriweather.className} text-gray-600`}>Najděte nejlepší ceny paliva ve vašem okolí.</p>
                        <LocationSearch />
                    </div>
                    <div className="justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                        <h1 className={`${merriweather.className} text-2xl font-bold`}>Zadejte svou polohu</h1>
                        <p className={`${merriweather.className} text-gray-600 mt-2`}>Pro zobrazení výsledků vyhledávání zadejte svou polohu do vyhledávacího pole.</p>
                    </div>
                </div>
            </main>
        );
    }

    try {
        const osmData: OSMData[] = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
        ).then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        });

        if (!osmData || osmData.length === 0) {
            throw new Error("No location data found for the provided query.");
        }

        return (
            <main className="flex min-h-screen flex-col p-6">
                <Header />
                <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
                    <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                        <p className={`${merriweather.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
                            <strong>PetrolScan srovnávač</strong>
                        </p>
                        <p className={`${merriweather.className} text-gray-600`}>Najděte nejlepší ceny paliva ve vašem okolí.</p>
                        <LocationSearch />
                    </div>
                    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
                        <SearchResults lat={osmData[0].lat} lng={osmData[0].lon} radius={Number(radius) ?? 10} sort={sort} fuelType={fuelType} fuelQuality={fuelQuality} />
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        console.error("Error rendering search page:", error);
        return (
            <main className="flex min-h-screen flex-col p-6">
                <Header />
                <div className="mt-4 flex grow flex-col gap-4 md:flex-row bg-gray-50 p-6">
                    <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
                        <p className={`${merriweather.className} text-xl text-red-600`}>Došlo k chybě při načítání výsledků. Zkuste to prosím znovu.</p>
                    </div>
                </div>
            </main>
        );
    }
}
