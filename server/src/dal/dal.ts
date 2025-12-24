import fs from "fs";
import Database, { Database as DB, RunResult } from "better-sqlite3";
import { DB_FILE } from "../appConfig";

export async function openDb(dbFile: string = DB_FILE): Promise<DB> {

    if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(dbFile, "");
    }

    const db = new Database(dbFile,
        {
            fileMustExist: false,
            verbose: undefined   
        });

    return db;
}

export async function runQuery(
    sql: string,
    params: Record<string, unknown> | unknown[] = []
): Promise<unknown[] | { changes: number; lastInsertRowid: number | bigint }> {

    console.log("about to run:");
    console.log(sql);   

    const db = await openDb();
    const stmt = db.prepare(sql); 

    // better-sqlite3 exposes whether the statement reads rows
    if ((stmt as any).reader === true) {
        // SELECT
        const result = Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
        db.close();
        return result;
    } else {
        // INSERT/UPDATE/DELETE
        const res: RunResult = Array.isArray(params)
            ? stmt.run(...params)
            : stmt.run(params);
        db.close();
        return { changes: res.changes, lastInsertRowid: res.lastInsertRowid };
    }
}