import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET ?? (() => { throw new Error('JWT_SECRET env is required'); })();
export function signAccessToken(user_id) {
    return jwt.sign({ sub: user_id, guard: 'jwt' }, SECRET, { expiresIn: '15m' });
}
export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, SECRET);
    if (typeof decoded != 'object' || decoded == null ||
        typeof decoded.sub !== 'number' || decoded.guard !== 'jwt') {
        throw new Error('Invalid token payload');
    }
    return decoded;
}
//# sourceMappingURL=jwt.js.map