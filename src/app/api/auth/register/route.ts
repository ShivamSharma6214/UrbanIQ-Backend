import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export function getPrisma() {
  if (!prisma) prisma = new PrismaClient();
  return prisma;
}

export async function POST(req: Request) {
  const prisma = getPrisma();
  const { name, email, password } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return NextResponse.json({ message: "User created", user: { id: user.id, email: user.email } });
}
