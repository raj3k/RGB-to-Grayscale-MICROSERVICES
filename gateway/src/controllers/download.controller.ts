import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import * as mongoDB from "mongodb";
import {getDB} from "../mongo";

export const downloadFile = async (req: Request, res: Response) => {
    const fid: unknown = req.query.fid
    if (!fid) {
        res.status(400).json({
            status: "failed",
            error: "fid required"
        })
    }
    try {
        const client = getDB();

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