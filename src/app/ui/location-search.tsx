/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/ui/location-search.tsx
 * Description: Location search component.
 ***************************************************************/

'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebouncedCallback } from 'use-debounce';
import osmSearch from "../lib/osm-search";
import OSMData from "../lib/types/OSMData";
import LocationAutocomplete from "./location-autocomplete";
import LocationSearchProps from "../lib/types/LocationSearchProps";
import { useSearchParams } from "next/navigation";

export default function LocationSearch() {
    const searchParams = useSearchParams();
    const [suggestions, setSuggestions] = useState<LocationSearchProps[]>([]);
    const [hideSuggestions, setHideSuggestions] = useState<boolean>(false);
    const [selectedLocation, setSelectedLocation] = useState<string>("");

    const handleSearch = useDebouncedCallback(async (term: string) => {
        if (!term.trim()) {
            // If the search term is empty, clear suggestions
            setSuggestions([]);
            console.debug("Search term is empty, clearing suggestions.");
            return;
        }

        // Reset hiding if user starts typing again (different from selection)
        if (term !== selectedLocation) {
            setHideSuggestions(false);
        }

        // Here you can handle the search term, e.g., send it to an API or update state
        try {
            const results: OSMData[] = await osmSearch(term.trim());

            setSuggestions(results.map((result) => ({
                lat: result.lat,
                lng: result.lon,
                name: result.display_name,
                id: parseInt(result.osm_id, 10) || 0 // Ensure id is a number
            })));

            // Log the suggestions to the console for debugging
            console.debug("Suggestions:", suggestions);
        } catch (error) {
            console.error("Error fetching OSM data:", error);
            return;
        }
    }, 300);

    const handleSelectSuggestion = (suggestion: LocationSearchProps) => {
        setHideSuggestions(true);
        setSelectedLocation(suggestion.name);
        // Add hidden inputs for coordinates
        document.getElementById('lat')?.setAttribute('value', suggestion.lat.toString());
        document.getElementById('lng')?.setAttribute('value', suggestion.lng.toString());
    };

    return (
        <form className="flex flex-col gap-4" action="/search" method="get">
            <label htmlFor="location" className="text-gray-700">
                Zadejte svou polohu:
            </label>
            <div className="relative w-full flex flex-col gap-4">
                <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="např. Praha, Česká republika"
                    className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("location") ?? ""}
                    required
                    autoComplete="off"
                />
                {suggestions.length > 0 && !hideSuggestions && (
                    <LocationAutocomplete
                        suggestions={suggestions}
                        onSelectSuggestion={handleSelectSuggestion}
                    />
                )}
            </div>
            <div className="flex flex-col gap-4 md:flex-row items-center justify-between">
                <label htmlFor="radius" className="text-gray-700">
                    Zadejte radius vyhledávání (v km):
                </label>
                <input
                    type="number"
                    id="radius"
                    name="radius"
                    className="rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0 w-24"
                    defaultValue={searchParams.get("radius") ? parseInt(searchParams.get("radius") as string, 10) : "10"}
                    required
                    min="1"
                />
            </div>

            {/* Hidden inputs for GPS coordinates */}
            <input type="hidden" id="lat" name="lat" />
            <input type="hidden" id="lng" name="lng" />

            <input
                type="hidden"
                name="sort"
                value={searchParams.get("sort") ?? "cheapest"}
            />
            <input
                type="hidden"
                name="fuel_type"
                value={searchParams.get("fuel_type") ?? "all"}
            />
            <input
                type="hidden"
                name="fuel_quality"
                value={searchParams.get("fuel_quality") ?? "all"}
            />
            <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Vyhledat <MagnifyingGlassIcon className="inline h-5 w-5" />
            </button>
        </form>
    );
}
