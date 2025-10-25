import { NextResponse } from "next/server";
import { getPrisma } from "../../auth/register/route";
import { requireAuth } from "../../../../lib/auth";

export async function GET(req: Request) {
  const userPayload = requireAuth(req);
  if (userPayload instanceof NextResponse) return userPayload; // not logged in

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: (userPayload as any).id },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ user });
}
