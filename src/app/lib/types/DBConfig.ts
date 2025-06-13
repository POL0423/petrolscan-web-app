/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/lib/types/DBConfig.ts
 * Description: Configuration for the database connection,
 *              type definition
 ***************************************************************/

export default interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
