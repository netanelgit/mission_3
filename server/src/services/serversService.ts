import { runQuery } from "../dal/dal";


export async function getAllServers(){

    const q = "SELECT * FROM Servers;";
    const res = await runQuery(q);    
    
    return res;    
}

export async function replaceServerStatus(serverId: number) {
    
    // First, get the current server to check if it exists and get its current status
    const selectQuery = "SELECT * FROM Servers WHERE id = ?;";
    const server: any = await runQuery(selectQuery, [serverId]);

    if (server.length === 0) {
        throw new Error(`Server with id ${serverId} not found.`);
    }

    // Toggle the status: if active, make it inactive; otherwise, make it active
    const currentStatus = server[0].status;
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const updateQuery = "UPDATE Servers SET status = ? WHERE id = ?;";
    const updateResult = await runQuery(updateQuery, [newStatus, serverId]);

    // Fetch and return the updated server
    const updatedServer: any = await runQuery(selectQuery, [serverId]);
    return updatedServer[0];
}
