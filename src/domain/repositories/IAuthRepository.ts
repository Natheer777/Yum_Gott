import { AuthToken, JWTpayload } from "../entities/AuthToken";

export interface IAuthRepository {
    generateToken(payload: string): Promise<AuthToken>
    verifyToken(token: string): Promise<JWTpayload>
    refreshToken(refreshToken: string): Promise<AuthToken>
}