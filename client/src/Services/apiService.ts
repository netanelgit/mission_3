// Backend base URL
const BASE_URL = "http://localhost:3030/api";

export interface Server {
    id: number;
    name: string;
    ip: string;
    hosting_company: string;
    status: string;
    created_at: string;
}


export async function getAllServers(): Promise<Server[]> {
    // console.log(accountId);
    const res = await fetch(`${BASE_URL}/servers`);
    
    if (!res.ok) {
        throw new Error("Failed to fetch servers");
    }

    return res.json();
}

export async function replaceServerStatus(serverId: number): Promise<Server> {
    
    const res = await fetch(`${BASE_URL}/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:  JSON.stringify({ "serverId": serverId })
    });

    if (!res.ok) {
        throw new Error("Failed to update server status");
    }
    return res.json();
}