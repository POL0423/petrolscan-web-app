/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/lib/types/FuelType.ts
 * Description: Type definition for fuel type.
 ***************************************************************/

type FuelType =     "DIESEL" |              // Diesel is the most common fuel type
                    "PETROL" |              // Petrol is the most common fuel type
                    "LPG" |                 // = Liquefied Petroleum Gas
                    "HVO" |                 // = Hydrotreated Vegetable Oil
                    "CNG" |                 // = Compressed Natural Gas
                    "ADBLUE" |              // = Synthetic pee acid
                    "WINDSCREEN_CLEANER" |  // = Windscreen washer fluid
                    "ALL" |                 // = All fuel types, used for filtering
                    "UNKNOWN";              // = Unknown fuel type, used for filtering

export default FuelType;
