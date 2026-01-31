
import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

type JwtPayload = {
    adminId: string;
    role: string;
};

export function signAdminToken(payload: JwtPayload, expiresIn: SignOptions['expiresIn'] = '1d') {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyAdminToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}
