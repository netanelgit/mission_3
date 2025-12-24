import { runQuery } from "../dal/dal";

export async function getAllServers(){
    const q = `
        SELECT
            s.id,
            s.name,
            s.ip,
            c.name as hosting_company,
            s.status,
            s.created_at
        FROM Servers s
        LEFT JOIN CompanyServers c ON s.hosting_company = c.id
    `;
    const res = await runQuery(q);
    return res;
}

export async function replaceServerStatus(serverId: number) {
    console.log("=== NEW FILE - replaceServerStatus called with serverId:", serverId);

    // First, get the current server to check if it exists and get its current status
    const selectQuery = `
        SELECT
            s.id,
            s.name,
            s.ip,
            c.name as hosting_company,
            s.status,
            s.created_at
        FROM Servers s
        LEFT JOIN CompanyServers c ON s.hosting_company = c.id
        WHERE s.id = ?
    `;
    const server: any = await runQuery(selectQuery, [serverId]);
    console.log("NEW FILE - Current server from DB:", server);

    if (server.length === 0) {
        throw new Error(`Server with id ${serverId} not found.`);
    }

    // Toggle the status: if active, make it inactive; otherwise, make it active
    const currentStatus = server[0].status;
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    console.log(`NEW FILE - Toggling status from ${currentStatus} to ${newStatus}`);

    // Update the server status
    const updateQuery = "UPDATE Servers SET status = ? WHERE id = ?;";
    const updateResult = await runQuery(updateQuery, [newStatus, serverId]);
    console.log("NEW FILE - Update result:", updateResult);

    // Fetch and return the updated server with company name
    const updatedServer: any = await runQuery(selectQuery, [serverId]);
    console.log("NEW FILE - Updated server from DB:", updatedServer);
    console.log("NEW FILE - Returning:", updatedServer[0]);
    return updatedServer[0];
}
