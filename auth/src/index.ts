import * as dotenv from "dotenv";
dotenv.config()

import express, {Application, Request, Response} from "express"
import authRouter from "./routes/authRouter";


const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Hello World</h2>");
});

app.use("/api/auth", authRouter);


app.listen(port, () => {
    console.log(`Auth service is listening on port ${port}`);
});