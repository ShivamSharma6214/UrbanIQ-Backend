import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_key";

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // contains { id, email, iat, exp }
  } catch (err) {
    return null;
  }
}

export function requireAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  return user;
}

