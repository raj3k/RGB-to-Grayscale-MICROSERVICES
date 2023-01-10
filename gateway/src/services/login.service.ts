import axios, {AxiosError, AxiosResponse} from "axios";
import {userCredentials} from "../types/userCredentials.type";
import {Token} from "../types/token.type";

export const loginService = async (userCred: userCredentials): Promise<AxiosError | Token> => {
    return new Promise((resolve, reject) => {
        axios.post("http://auth:3000/api/auth/login", {
            email: userCred.email,
            password: userCred.password
        })
            .then((response:AxiosResponse) => {
                resolve(response.data.token as Token);
            })
            .catch((err) => {
                reject(err);
            })
    });
}