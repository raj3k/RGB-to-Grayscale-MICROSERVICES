import {Request, Response} from "express";
import connect from "../database";
import {RowDataPacket} from "mysql2";
import {createJWT} from "../util/createJWTToken";
import {verifyToken, Token} from "../util/verifyToken";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const con = await connect();
        const sqlQuery = 'SELECT email, password FROM user WHERE email=?';
        const results = await con.execute(sqlQuery, [email]);
        const user_row = (results[0] as RowDataPacket[])[0];

        if (user_row) {

            if (email !== user_row.email || password !== user_row.password) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid credentials"
                });
            } else {
                // create JWT Token
                return res.json({
                    status: "success",
                    token: createJWT(email)
                })
            }
        } else {
            res.status(401).json({
                status: "failed",
                message: "Invalid credentials"
            });
        }
    } catch(e) {
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
}

export const validateToken = async (req: Request, res: Response) => {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized"
        });
    }

    const accessToken = bearer.split('Bearer ')[1].trim();
    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                status: "failed",
                message: "Unauthorized"
            });
        }

        const con = await connect();
        const sqlQuery = 'SELECT email FROM user WHERE email=?';
        const results = await con.execute(sqlQuery, [payload.email]);

        const email = (results[0] as RowDataPacket[])[0].email

        res.json({
            status: "success",
            email: email
        });

    } catch(e) {
        res.status(500).json({
            status: "failed",
            message: "Internal Server error"
        })
    }
}