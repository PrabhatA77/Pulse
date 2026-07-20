import cors from "cors";
import express , {type Express} from "express";
import type { SessionStatus } from "../../shared/types/session.types.js";

export function createApp():Express{
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get("/health",(_req,res)=>{
        const states:SessionStatus[] = ["idle","coding","evaluated"];
        res.json({status:"ok",sample:states});
    });

    return app;
}