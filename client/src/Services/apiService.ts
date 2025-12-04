// Backend base URL
const BASE_URL = "http://localhost:3030";

export interface Account {
    id: number;
    name: string;
}

export interface AccountOperation {
    id: number;
    accountID: number;
    typeOperation: string;
    sumMoney: number;
    sumPayments: number | null;
    dateOperation: string;
    Interest: number | null;
}
export interface CreateAccountOperation {
    id?: number;
    accountID: number;
    typeOperation: string;
    sumMoney: number;
    sumPayments: number | null;
    dateOperation: string;
    Interest: number | null;
}

export async function getAccountOperationById(accountId: number): Promise<AccountOperation[]> {
    // console.log(accountId);
    const res = await fetch(`${BASE_URL}/accountOperation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ accountId })
    });
    

    if (!res.ok) {
        throw new Error("Failed to fetch accountOperation");
    }

    return res.json();
}


export async function addOperation(payload: CreateAccountOperation): Promise<AccountOperation> {
    console.log(JSON.stringify(payload));
    
    const res = await fetch(`${BASE_URL}/addOperation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Failed to create operation");
    }

    return res.json();
}
