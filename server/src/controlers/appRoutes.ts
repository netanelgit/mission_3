import express, { NextFunction, Request, Response } from "express"
import { getAccountById, getAllAccounts } from "../services/AccountsService";
import { createOperation, getOperationByAccountId } from "../services/operationService";

export const routes = express.Router();

routes.get("/accounts", async (req: Request, res: Response, next: NextFunction) => {    
    const accounts = await getAllAccounts();
    res.status(200).json(accounts);
})

routes.post("/accountOperation", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(req.body);
        
        const accountsID : number = req.body.accountId;
        if (!accountsID) {
            return res.status(400).json({
                error: "accountsID is required"
            });
        }  
        // const account = await getAccountById(id);
        const operation = await getOperationByAccountId(accountsID);
        res.status(200).json(operation);
    } catch (err) {
        next(err);
    }
});


routes.post("/addOperation", async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    
    try {
        const id = req.body.id || null;
        const accountID = req.body.accountID; 
        const typeOperation = req.body.typeOperation
        const sumMoney  = req.body.sumMoney;
        const sumPayments = req.body.sumPayments || null;
        const dateOperation = req.body.dateOperation || new Date().toISOString();
        const interest = req.body.Interest || null;
        if (!accountID) {
            return res.status(400).json({
                error: "accountsID is required"
            });
        }        

        const serviceRes = await createOperation(accountID, typeOperation, sumMoney, sumPayments, dateOperation, interest);
        res.status(201).json(serviceRes);

    } catch (err) {
        next(err);
    }
});