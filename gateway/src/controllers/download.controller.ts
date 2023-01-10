import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import * as mongoDB from "mongodb";

export const downloadFile = async (req: Request, res: Response) => {
    const fid: unknown = req.query.fid
    if (!fid) {
        res.status(400).json({
            status: "failed",
            error: "fid required"
        })
    }
    try {
        // TODO: resolve issue with mongo connection
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

        await client.connect();

        const db = client.db("converted");
        const bucket = new mongoDB.GridFSBucket(db);

        bucket.openDownloadStream(new ObjectId(fid as string)).pipe(res)

    } catch (e) {
        res.status(500).json({
            status: "failed",
            error: e
        })
    }
}