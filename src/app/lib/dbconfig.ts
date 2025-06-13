/***************************************************************
 * PetrolScan - A web application for comparing fuel prices
 * Created by: Marek Poláček (POL0423)
 * License: MIT License
 * This file is part of the PetrolScan project.
 *
 * File: src/app/lib/dbconfig.ts
 * Description: Configuration for the database connection.
 ***************************************************************/

import DBConfig from "./types/DBConfig";

const dbConfig: DBConfig = {
  host:         process.env.DB_HOST             ?? "localhost",
  port:         Number(process.env.DB_PORT)     ?? 3306,
  user:         process.env.DB_USER             ?? "root",
  password:     process.env.DB_PASSWORD         ?? "",
  database:     process.env.DB_NAME             ?? "default",
};

export default dbConfig;
