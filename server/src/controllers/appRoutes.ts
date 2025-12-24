import express, { NextFunction, Request, Response } from "express"
import { getAllServers, replaceServerStatus } from "../services/serversServiceNew";

export const routes = express.Router();

routes.get("/servers", async (req: Request, res: Response, next: NextFunction) => {    
    const servers = await getAllServers();
    res.status(200).json(servers);
})

routes.post("/status", async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("=== /status endpoint hit ===");
        const serverID : number = Number(req.body.serverId);
        console.log("Received serverID:", serverID);
        if (!serverID || isNaN(serverID)) {
            return res.status(400).json({
                error: "Valid serverId is required"
            });
        }
        // replace server status logic
        console.log("About to call replaceServerStatus");
        const status = await replaceServerStatus(serverID);
        console.log("Got result from replaceServerStatus:", status);
        console.log("Type of result:", typeof status, Array.isArray(status));
        res.status(200).json(status);
    } catch (err) {
        console.error("Error in /status endpoint:", err);
        next(err);
    }
});