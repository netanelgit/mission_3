import { Database as DB } from "better-sqlite3";
import { openDb, runQuery } from "./dal";


function initDbSchema(db: DB): void {

const ddl = `
CREATE TABLE Account (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE AccountOperation (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    AccountID   INTEGER NOT NULL,
    typeOperation text NOT NULL,
    sumMoney  FLOAT NOT NULL,
    sumPayments INTEGER,
    dateOperation Date NOT NULL DEFAULT (datetime('now')),
    
    FOREIGN KEY (AccountID) REFERENCES Account(id)
);
`;

    db.exec("BEGIN");
    try {
        db.exec(ddl);
        db.exec("COMMIT");
    } catch (e) {
        db.exec("ROLLBACK");
        throw e;
    }
}

// im missing this field in the AccountOperation table
async function addInterestColumn() {
    // Run this to add the Interest column to existing AccountOperation table
    try {
        await runQuery(`ALTER TABLE AccountOperation ADD COLUMN Interest FLOAT;`);
        console.log("Interest column added successfully");
    } catch (e) {
        console.log("Interest column already exists or error:", e);
    }
}

async function generateSampleData() {

    // --- AccountBank ---
    // fields: accountID , name
    const Account = [
        { accountID: 1, name: "Jon Brice" },
        { accountID: 2, name: "Jane Doe" },
        { accountID: 3, name: "Alice Smith" },
        { accountID: 4, name: "Bob Johnson" },
        { accountID: 5, name: "Charlie Brown" },
        { accountID: 6, name: "Diana Prince" },
        { accountID: 7, name: "Ethan Hunt" },
        { accountID: 8, name: "Fiona Gallagher" },
        { accountID: 9, name: "George Costanza" },
        { accountID: 10, name: "Hannah Montana" }
    ];

    Account.forEach(async acc => {
        await runQuery(`INSERT INTO Account (id, name) VALUES (${acc.accountID}, '${acc.name}');`);
    });

}

console.log("Starting init DB");
openDb().then((db: any) => {
    // initDbSchema(db);
    addInterestColumn();  // Add this to add the Interest column to existing table
    console.log("Done init DB");
})

// generateSampleData();

