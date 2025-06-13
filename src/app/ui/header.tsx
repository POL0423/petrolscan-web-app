/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/ui/header.tsx
 * Description: Header component.
 ***************************************************************/

import PetrolScanLogo from "./petrolscan-logo";

export default function Header() {
    return (
        <header className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
            <PetrolScanLogo />
        </header>
    );
}
