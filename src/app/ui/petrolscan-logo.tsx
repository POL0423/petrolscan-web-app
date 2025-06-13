/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/ui/petrolscan-logo.tsx
 * Description: PetrolScan logo component.
 ***************************************************************/

import { FunnelIcon } from '@heroicons/react/24/outline';
import { merriweather } from '@/app/ui/fonts';
import Link from 'next/link';

export default function PetrolScanLogo() {
    return (
        <div
            className={`${merriweather.className} flex flex-row items-center leading-none text-white`}
        >
            <Link href="/" className="mr-2 flex flex-row items-center gap-2">
                <FunnelIcon className="h-12 w-12" />
                <p className="text-[44px]">PetrolScan</p>
            </Link>
        </div>
    );
}
