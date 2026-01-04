import { SignJWT, jwtVerify } from "jose";
import { JWTUserPayload } from '@/types';

const SECRET_KEY = process.env.JWT_SECRET;
const key = new TextEncoder().encode(SECRET_KEY);

export async function signJWT(payload: JWTUserPayload, expiresIn: string = "7d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as JWTUserPayload;
  } catch (error) {
    return null;
  }
}
