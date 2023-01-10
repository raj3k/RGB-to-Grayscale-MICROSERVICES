import {Request, Response} from "express"
import multer from "multer";
import {GridFsStorage} from 'multer-gridfs-storage';
import amqp from "amqplib"

const storage = new GridFsStorage({url: `${process.env.DB_CONN_STRING}/preconverted`})

const upload = multer({storage}).single('image')

export const uploadFile = async (req: Request, res: Response) => {
    upload(req, res, async (err: unknown) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(400).json({
                status: "failed",
                error: "Multer Error"
            })
        } else if (err) {
            // An unknown error occurred when uploading.
            res.status(500).json({
                status: "failed",
                error: err
            })
        }
        // Everything went fine.
        try {
            
            const queue = 'preconverted';
            const conn: amqp.Connection = await amqp.connect('amqp://rabbitmq');

            const channel = await conn.createChannel();
            // await channel.assertQueue(queue)

            const msg = {
                // TODO: add if to check if req.file exists
                fid: req.file?.id.toString(),
                converted_fid: null,
                email: req.email
            };

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);

            res.json({
                status: "success",
                fid: req.file?.id
            })
        } catch (err) {
            storage._removeFile(req, req.file, () => {
                res.json({
                    status: "failed",
                    email: err
                })
            })
        }
    })
}