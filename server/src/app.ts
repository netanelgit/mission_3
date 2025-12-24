import express, { NextFunction, Request, Response } from "express"
// import { openDb, runQuery } from "./dal/dal";
import cors from "cors";
import { routes } from "./controllers/appRoutes";

const server = express();

// CORS
server.use(cors({
    origin: [
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5173"
    ]
}))

server.use(express.json()); // load body into "request" object

server.get("/ping", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("PONG");
});

server.use("/api", routes);

server.listen(3030, () => console.log(`Express server started.\nhttp://localhost:3030`));
