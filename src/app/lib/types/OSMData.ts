/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/lib/types/OSMData.ts
 * Description: Configuration for the database connection,
 *              type definition
 ***************************************************************/

export default interface OSMData {
    lat: number;                    // Latitude of the OSM data point
    lon: number;                    // Longitude of the OSM data point
    display_name: string;           // Human-readable name of the location
    osm_id: string;                 // Unique identifier for the OSM data point
    [key: string]: unknown;         // Additional properties that may be included in
                                    // the OSM data (irrelevant for the type definition)
}
