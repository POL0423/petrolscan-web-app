/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/ui/search/results.tsx
 * Description: Rendering search results based on user input.
 *              It fetches data from the database and displays
 *              the results in a user-friendly format.
 ***************************************************************/

import mysql, { FieldPacket, RowDataPacket } from 'mysql2/promise';
import dbConfig from "@/app/lib/dbconfig";
import { merriweather } from '../fonts';
import FuelType from '@/app/lib/types/FuelType';
import FuelQuality from '@/app/lib/types/FuelQuality';
import SearchResultsFilters from './results/filters';

export function translateFuelType(fuelType: FuelType | string): string {
    switch (fuelType) {
        case "PETROL":
            return 'Benzín';
        case "DIESEL":
            return 'Nafta';
        case "ADBLUE":
            return 'AdBlue';
        case "WINDSCREEN_CLEANER":
            return 'Kapalina do ostřikovačů';
        default:
            return fuelType;        // For unknown or other types, return as is
    }
}

export function translateFuelQuality(fuelQuality: FuelQuality | string): string {
    switch (fuelQuality) {
        case "STANDARD":
            return 'Standardní';
        case "MIDGRADE":
            return 'Střední';
        case "PREMIUM":
            return 'Prémiová';
        case "RACING":
            return 'Závodní';
        default:
            return fuelQuality;     // For unknown or other types, return as is
    }
}

export function isValidFuelType(fuelType: string): fuelType is FuelType {
    return ["DIESEL", "PETROL", "LPG", "HVO", "CNG", "ADBLUE", "WINDSCREEN_CLEANER", "ALL", "UNKNOWN"]
        .includes(fuelType.toUpperCase());
}

export function isValidFuelQuality(fuelQuality: string): fuelQuality is FuelQuality {
    return ["STANDARD", "MIDGRADE", "PREMIUM", "RACING", "ALL", "UNKNOWN"]
        .includes(fuelQuality.toUpperCase());
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Radius of the Earth in kilometers
    const R = 6371;

    // Convert latitude and longitude from degrees to radians
    // This is necessary for the Haversine formula to work correctly
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;

    // Haversine formula to calculate the distance between two points on the Earth
    // Reference: https://en.wikipedia.org/wiki/Haversine_formula
    // Using the Haversine formula to calculate the distance
    // between two points on the surface of a sphere given their latitude and longitude
    const d = 2 * R * Math.asin(
        Math.sqrt(
            Math.sin((lat2Rad - lat1Rad) / 2) ** 2 +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin((lon2Rad - lon1Rad) / 2) ** 2
        )
    );

    // Return the distance in kilometers, rounded to one decimal place
    return Math.round(d * 10) / 10;
}

/**
 * 
 * @param lat Latitude of the search location
 * @param lng Longitude of the search location
 * @param radius Search radius in kilometers
 * @returns
 */
export default async function SearchResults({
    lat, lng, radius, sort, fuelType, fuelQuality
}: {
    lat: number; lng: number; radius: number; sort: string; fuelType: string; fuelQuality: string;
}) {
    const latitude = Number(lat);
    const longitude = Number(lng);
    const r = Number(radius);
    const sorting = sort === 'desc' ? 'desc' : 'asc';
    // Default to ascending if not 'desc'
    const fuelTypeCap = fuelType.toUpperCase();
    const fuelQualityCap = fuelQuality.toUpperCase();

    const connection = await mysql.createConnection(dbConfig);

    const geoQuery = `
        SELECT 
            station_name, 
            station_loc_name, 
            station_loc_lat, 
            station_loc_lon,
            MAX(timestamp) AS last_update,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', id,
                    'timestamp', timestamp,
                    'fuel_type', fuel_type,
                    'fuel_quality', fuel_quality,
                    'fuel_name', fuel_name,
                    'fuel_price', fuel_price
                )
            ) AS fuels
        FROM petrolscan_data
        WHERE (
            ST_Distance_Sphere(
                POINT(station_loc_lon, station_loc_lat),
                POINT(?, ?),
                6371
            ) <= ?
            ${fuelTypeCap !== 'ALL' ? 'AND fuel_type = ?' : ''}
            ${fuelQualityCap !== 'ALL' ? 'AND fuel_quality = ?' : ''}
        )
        GROUP BY 
            station_name, 
            station_loc_name, 
            station_loc_lat, 
            station_loc_lon
        ORDER BY fuel_price ${sorting === 'desc' ? 'DESC' : 'ASC'};
    `;

    // Debugging: Log the query and parameters
    console.debug("Executing query:", geoQuery);
    console.debug("With parameters:", { longitude, latitude, r, fuelTypeCap, fuelQualityCap });
    console.debug("Compiled SQL query:", mysql.format(geoQuery,
        [longitude, latitude, r, ...(fuelTypeCap !== 'ALL' ? [fuelTypeCap] : []),
        ...(fuelQualityCap !== 'ALL' ? [fuelQualityCap] : [])]));

    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.execute<RowDataPacket[]>(geoQuery,
            [longitude, latitude, r, ...(fuelTypeCap !== 'ALL' ? [fuelTypeCap] : []),
            ...(fuelQualityCap !== 'ALL' ? [fuelQualityCap] : [])]
        );

        // Debugging: Log the raw rows returned from the database
        console.debug("Number of rows:", rows.length);
        console.debug("Parameters:", { longitude, latitude, r, fuelTypeCap, fuelQualityCap });
        console.debug("Raw rows from database:", rows);
        console.debug("Fields:", fields);

        if (rows.length === 0) {
            return (
                <div className="text-center mt-10">
                    <h1 className={`${merriweather.className} text-2xl font-bold`}>Nebyly nalezeny žádné výsledky</h1>
                    <p>Nebyla nalezena žádná čerpací stanice v zadaném okruhu.</p>
                </div>
            );
        }

        const results = rows.map(row => {
            const fuels = (row.fuels && typeof row.fuels === 'string')
                ? JSON.parse(row.fuels ?? '[]')
                : (Array.isArray(row.fuels) ? row.fuels : []);
            return {
                station_name: row.station_name,
                station_address: row.station_loc_name,
                station_loc_lat: row.station_loc_lat,
                station_loc_lon: row.station_loc_lon,
                last_update: row.last_update,
                fuels: fuels,
            };
        });

        return (
            <div className="mx-auto">
                <h1 className={`${merriweather.className} text-2xl font-bold`}>Výsledky hledání</h1>
                <SearchResultsFilters />
                <p>Celkem nalezeno {results.length} čerpacích stanic.</p>
                <ul className="list-disc pl-6 m-4 px-4 scrollable max-h-80 overflow-y-auto">
                    {results.map((row) => (
                        <li key={row.station_address} className="mb-4">
                            <p className="text-lg">
                                <strong>{row.station_name}</strong> - {row.station_address} ({row.station_loc_lat}, {row.station_loc_lon})
                            </p>
                            <h2 className={`${merriweather.className}`}>Ceny paliv:</h2>
                            <ul className="list-disc pl-6">
                                {row.fuels.map((fuel: {
                                    id: number;
                                    timestamp: string;
                                    fuel_type: string;
                                    fuel_quality: string;
                                    fuel_name: string;
                                    fuel_price: number;
                                }) => (
                                    <li key={fuel.id}>
                                        <p><strong>{fuel.fuel_name}</strong>: {Number(fuel.fuel_price).toFixed(2).replace('.', ',')} Kč/l</p>
                                        <div className="text-sm text-gray-500 flex flex-wrap flex-row gap-2">
                                            <p><span className="font-semibold">Typ:</span> {translateFuelType(fuel.fuel_type)}</p>
                                            <p>•</p>
                                            <p><span className="font-semibold">Kvalita:</span> {translateFuelQuality(fuel.fuel_quality) ?? 'Nerozhoduje'}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className='text-sm'>Vzdálenost: {calculateDistance(row.station_loc_lat, row.station_loc_lon, latitude, longitude).toFixed(1).replace('.', ',')} km</p>
                            <p className='text-xs text-gray-500'>Celkem {row.fuels.length} druhů paliva.</p>
                            <p className='text-xs text-gray-500'>Poslední aktualizace: {row.last_update.toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    catch (error) {
        console.error("Error executing query:", error);
        return (
            <div className="text-center w-full mt-10">
                <h1 className={`${merriweather.className} text-2xl font-bold`}>Chyba</h1>
                <p className='error'>Nastala chyba při načítání výsledků vyhledávání.</p>
            </div>
        );
    }
    finally {
        await connection.end();
    }
}
