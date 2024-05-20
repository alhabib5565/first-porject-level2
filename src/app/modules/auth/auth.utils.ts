import jwt, { JwtPayload } from "jsonwebtoken"

type TCreateToekn = {
    jwtPayload: JwtPayload
    secret: string,
    expiresIn: string
}

export const createToekn = ({ jwtPayload, secret, expiresIn }: TCreateToekn) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn
    })
}