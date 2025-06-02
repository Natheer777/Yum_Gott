import jwt from 'jsonwebtoken';
import { AuthToken, JWTpayload } from '@/domain/entities/AuthToken';
import { IAuthRepository } from '@/domain/repositories/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  private readonly jwtSecret: string;
  private readonly jwtExpiration: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-key';
    this.jwtExpiration = process.env.JWT_EXPIRATION || '24h';
  }

  async generateToken(payload: JWTpayload): Promise<AuthToken> {
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
    });

    return {
      accessToken,
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
    };
  }

  async verifyToken(token: string): Promise<JWTpayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTpayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const payload = await this.verifyToken(refreshToken);
    return this.generateToken(payload);
  }
}