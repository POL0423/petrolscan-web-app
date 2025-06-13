/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/lib/osm-search.ts
 * Description: Search API for OpenStreetMap Nominatim.
 ***************************************************************/

import OSMData from "./types/OSMData";

export default async function osmSearch(query: string): Promise<OSMData[]> {
    if (!query) {
        throw new Error("Query parameter is required");
    }

    // Encode the query to ensure it is safe for use in a URL
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=10`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OSMData[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching OSM data:", error);
        throw error;
    }
}
