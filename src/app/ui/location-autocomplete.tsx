/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/ui/location-autocomplete.tsx
 * Description: Location autocomplete component.
 ***************************************************************/

'use client';

import Link from "next/link";
import LocationSearchProps from "../lib/types/LocationSearchProps";

export default function LocationAutocomplete({ 
    suggestions, 
    onSelectSuggestion 
}: {
    suggestions: LocationSearchProps[];
    onSelectSuggestion: (suggestion: LocationSearchProps) => void;
}) {
    return (
        <div id="suggestions" className="absolute left-0 right-0 top-full z-10 bg-white border rounded-lg shadow-lg">
            <p className="px-4 py-2 text-gray-500">Klikněte na položku pro výběr</p>
            <ul className="max-h-40 overflow-y-auto">
                {suggestions.map((suggestion) => (
                    <li key={suggestion.id}
                        className="px-4 py-2 hover:bg-blue-100"
                        data-lat={suggestion.lat}
                        data-lng={suggestion.lng}
                        data-name={suggestion.name}
                        data-id={suggestion.id}
                        onClick={() => {
                            // Change the location in the search input
                            const input = document.getElementById('location') as HTMLInputElement;
                            if (input) {
                                input.value = suggestion.name;
                            }
                            // Call the callback to hide suggestions
                            onSelectSuggestion(suggestion);
                        }}
                    >
                        {suggestion.name}
                    </li>
                ))}
            </ul>
            <p className="px-4 py-2 text-gray-500 text-sm">Data z <Link href="https://openstreetmap.org">OpenStreetMap</Link></p>
        </div>
    );
}
