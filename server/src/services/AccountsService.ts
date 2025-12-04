import { runQuery } from "../dal/dal";

export async function getAllAccounts(){

    const q = "SELECT * FROM Account;";
    const res = await runQuery(q);    
    
    return res;    
}

export async function getAccountById(accountId: number) {
    const q = "SELECT * FROM Account WHERE id = ?;";
    // to fix type
    const res : any = await runQuery(q, [accountId]);
    if (res.length === 0) {
        throw new Error(`Account with id ${accountId} not found.`);
    }
    return res[0];
}
