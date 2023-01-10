import jwt from "jsonwebtoken";

export const createJWT = (email: string): string => {
    return jwt.sign({ email: email }, process.env.JWT_SECRET as jwt.Secret,
        {expiresIn: '1d', algorithm: "HS256"});
};