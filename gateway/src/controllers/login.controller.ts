import {Request, Response} from "express";
import {AxiosError} from "axios";
import {Token} from "../types/token.type";
import {loginService} from "../services/login.service";

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400).json({
            status: "failed",
            message: "Email or password not provided"
        });
    }

    const userCredentials = {
        email: email,
        password: password
    }

    try {

        const token: Token | AxiosError = await loginService(userCredentials);

        res.json({
            status: "success",
            token: token
        });
    } catch (e) {
        if (e instanceof AxiosError) {
            res.status(e.response?.status || 500).json({
                status: "failed",
                message: e
            })
        } else {
            res.status(500).json({
                status: "failed",
                message: e
            })
        }
    }
}
