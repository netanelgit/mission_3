import { Database as DB } from "better-sqlite3";
import { openDb, runQuery } from "./dal";


function initDbSchema(db: DB): void {

const ddl = `
CREATE TABLE Servers (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ip   TEXT NOT NULL,
    hosting_company TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at Date NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (hosting_company) REFERENCES CompanyServers(id)
);

CREATE TABLE CompanyServers (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
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

async function generateSampleData() {

    // --- CompanyServers ---
    const companies = [
        { id: 1, name: "DigitalIO" },
        { id: 2, name: "Microsoft" },
        { id: 3, name: "IBM" },
        { id: 4, name: "GoDaddy" }
    ];

    for (const company of companies) {
        await runQuery(`INSERT INTO CompanyServers (id, name) VALUES (${company.id}, '${company.name}');`);
    }

    // --- Servers ---
    const servers = [
        { id: 1, name: "Web Server 1", ip: "192.168.1.10", hosting_company: 1, status: "active", created_at: "2024-01-15 10:30:00" },
        { id: 2, name: "Web Server 2", ip: "192.168.1.11", hosting_company: 1, status: "active", created_at: "2024-03-22 14:45:00" },
        { id: 3, name: "Database Server", ip: "192.168.1.20", hosting_company: 2, status: "active", created_at: "2024-05-10 09:15:00" },
        { id: 4, name: "API Server", ip: "192.168.1.30", hosting_company: 3, status: "active", created_at: "2024-07-18 16:20:00" },
        { id: 5, name: "Backup Server", ip: "192.168.1.40", hosting_company: 4, status: "inactive", created_at: "2024-09-05 11:00:00" },
        { id: 6, name: "Development Server", ip: "192.168.1.50", hosting_company: 4, status: "active", created_at: "2024-10-12 13:30:00" },
        { id: 7, name: "Testing Server", ip: "192.168.1.60", hosting_company: 2, status: "inactive", created_at: "2024-11-28 08:45:00" },
        { id: 8, name: "Production Server", ip: "192.168.1.70", hosting_company: 1, status: "active", created_at: "2024-12-20 15:10:00" }
    ];

    for (const server of servers) {
        await runQuery(
            `INSERT INTO Servers (id, name, ip, hosting_company, status, created_at) VALUES (${server.id}, '${server.name}', '${server.ip}', ${server.hosting_company}, '${server.status}', '${server.created_at}');`
        );
    }

}

console.log("Starting init DB");
openDb().then((db: any) => {
    // initDbSchema(db);
    console.log("Done init DB");
})

// generateSampleData();

