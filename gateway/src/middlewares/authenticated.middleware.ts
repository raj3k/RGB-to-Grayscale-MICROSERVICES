import {Request, Response, NextFunction} from "express";
import axios from "axios";

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(403).json({
            status: "failed",
            message: "No Access Token"
        });
    }

    const accessToken = bearer.split('Bearer ')[1].trim();
    axios.get("http://auth:3000/api/auth/validate", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
        .then((response) => {
            req.email = response.data.email
            next();
        })
        .catch((error) => {
            return res.status(401).json({
                status: "failed",
                message: "Unauthorized!"
            });
        })
}