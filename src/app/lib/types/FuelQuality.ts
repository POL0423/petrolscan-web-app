/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/lib/types/FuelQuality.ts
 * Description: Type definition for fuel quality.
 ***************************************************************/

type FuelQuality =      "REGULAR" |         // Regular fuel (cheaper option)
                        "PREMIUM" |         // Premium fuel (more expensive option)
                        "RACING" |          // Racing fuel (most expensive, provided by some petrol stations)
                        "ALL" |             // All fuel qualities, used for filtering
                        "UNKNOWN";          // Unknown fuel quality, used for filtering

export default FuelQuality;
