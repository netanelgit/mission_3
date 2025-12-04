import { runQuery } from "../dal/dal";

// const accountsID = req.body.accountsID; 
//         const typeOperation = req.body.typeOperation
//         const sumMoney  = req.body.sumMoney;
//         const sumPayments = req.body.sumPayments || null;
//         const dateOperation = req.body.dateOperation || new Date().toISOString();

export async function getOperationByAccountId(accountId: number) {
    const q = `
        SELECT * FROM AccountOperation WHERE AccountID = ?;
    `;

    const params = [accountId];
    const res = await runQuery(q, params);
    return res;
}

export async function createOperation(
    accountsID: number,
    typeOperation: string,
    sumMoney: number,
    sumPayments: number | null = null,
    dateOperation: string = new Date().toISOString(),
    interest: number | null = null
) {

    // Basic guard
    if (!accountsID || !typeOperation || !sumMoney) {
        throw new Error("the properties accountsID, typeOperation, and sumMoney are required.");
    }

    if (typeOperation === "loan" && (interest === null || sumPayments === null)) {
        throw new Error("For loan operations, both interest and sumPayments are required.");
    }

    if (sumMoney <= 0) {
        throw new Error("sumMoney must be a positive number.");
    }

    const q = `
        INSERT INTO AccountOperation (AccountID, typeOperation, sumMoney, sumPayments, dateOperation, Interest)
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING typeOperation, sumMoney, sumPayments, dateOperation, Interest;
    `;

    const params = [accountsID, typeOperation, sumMoney, sumPayments, dateOperation, interest];

    // runQuery returns an array, so take first row
    const res = await runQuery(q, params);
    return res;
}