/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/ui/fonts.ts
 * Description: Configuration for the database connection.
 ***************************************************************/

import { Inter, Merriweather } from 'next/font/google';
 
export const inter = Inter({
    subsets: ['latin', 'latin-ext'],
    weight: ['400', '500', '600', '700'],
});
export const merriweather = Merriweather({
    subsets: ['latin', 'latin-ext'],
    weight: ['400', '700'],
});
