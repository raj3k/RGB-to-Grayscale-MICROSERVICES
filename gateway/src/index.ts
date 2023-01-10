import * as dotenv from "dotenv"
dotenv.config();

import express, {Application} from "express";
import cors from "cors";
import gatewayRouter from "./routes/gatewayRouter";
import { connectToDatabase } from "./mongo";


const app: Application = express();
const port = process.env.PORT || 3050;

app.use(express.json());
app.use(cors());

connectToDatabase()
    .then(() => {
        app.use("/api/gateway", gatewayRouter);
        app.listen(port, () => {
            console.log(`Gateway service is listening on port ${port}`);
        });
    })
    .catch((error: Error) => {
        console.log("Database connection failed", error);
        process.exit();
    });


