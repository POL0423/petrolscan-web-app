/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/lib/types/LocationSearchProps.ts
 * Description: Configuration for the database connection,
 *              type definition
 ***************************************************************/

export default interface LocationSearchProps {
    lat: number;        // Latitude of the location
    lng: number;        // Longitude of the location
    name: string;       // Name of the location
    id: number;         // Unique identifier for the location
}
