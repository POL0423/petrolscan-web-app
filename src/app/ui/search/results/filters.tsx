/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/ui/search/results/filters.tsx
 * Description: Filters for search results.
 ***************************************************************/

'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchResultsFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);

    const sort = params.get('sort') ?? 'cheapest';
    const fuelType = params.get('fuel_type') ?? 'all';
    const fuelQuality = params.get('fuel_quality') ?? 'all';

    // Debounced function to handle search parameters update
    const handleFilters = useDebouncedCallback((sort: string, fuelType: string, fuelQuality: string) => {
        params.set('sort', sort);
        params.set('fuel_type', fuelType);
        params.set('fuel_quality', fuelQuality);
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <form className='flex flex-col md:flex-row gap-2 items-center bg-gray-100 p-4 rounded-lg text-sm'>
            <label htmlFor='sort' className='text-gray-700'>Řazení:</label>
            <select
                id='sort'
                name='sort'
                className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0'
                defaultValue={sort}
                onChange={(e) => {
                    handleFilters(e.target.value, fuelType, fuelQuality);
                }}
            >
                <option value="asc">Od nejlevnějšího</option>
                <option value="desc" >Od nejdražšího</option>
            </select>
            <label htmlFor='fuel_type' className='text-gray-700 ml-4'>Typ paliva:</label>
            <select
                id='fuel_type'
                name='fuel_type'
                className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0'
                defaultValue={fuelType}
                onChange={(e) => {
                    handleFilters(sort, e.target.value, fuelQuality);
                }}
            >
                <option value="all">Všechna paliva</option>
                <option value="petrol">Benzín</option>
                <option value="diesel">Nafta</option>
                <option value="lpg">LPG</option>
                <option value="hvo">HVO</option>
                <option value="cng">CNG</option>
                <option value="adblue">AdBlue</option>
                <option value="windscreen_cleaner">Kapalina do ostřikovačů</option>
            </select>
            <label htmlFor='fuel_quality' className='text-gray-700 ml-4'>Kvalita:</label>
            <select
                id='fuel_quality'
                name='fuel_quality'
                className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0'
                defaultValue={fuelQuality}
                onChange={(e) => {
                    handleFilters(sort, fuelType, e.target.value);
                }}
            >
                <option value="all">Nerozhoduje</option>
                <option value="standard">Standardní</option>
                <option value="midgrade">Střední</option>
                <option value="premium">Prémiová</option>
                <option value="racing">Závodní</option>
            </select>
        </form>
    );
}
