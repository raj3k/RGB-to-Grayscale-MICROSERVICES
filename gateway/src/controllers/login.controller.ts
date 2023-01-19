import {Request, Response} from "express";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Token} from "../types/token.type";

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
        const response: AxiosResponse = await axios.post("http://auth:3000/api/auth/login", {
            email: userCredentials.email,
            password: userCredentials.password
        });
        const token: Token = response.data.token;

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
