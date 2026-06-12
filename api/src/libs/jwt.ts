import { JwtPayload } from "../types/auth.types.js";
import jwt from "jsonwebtoken";

const SECRET: string = process.env.JWT_SECRET ?? (() => { throw new Error('JWT_SECRET env is required') })();

export function signAccessToken(user_id: number): string {
    return jwt.sign(
        { sub: user_id, guard: 'jwt' } satisfies Omit<JwtPayload, 'iat' | 'exp'>,
        SECRET,
        { expiresIn: '15m' },
    );
}

export function verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, SECRET) as unknown as JwtPayload;
    if (typeof decoded != 'object' || decoded == null ||
        typeof decoded.sub !== 'number' || decoded.guard !== 'jwt') {
        throw new Error('Invalid token payload');
    }
    return decoded;
}