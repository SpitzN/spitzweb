// src/lib/db.ts

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getSinglePost(slug: string) {
  const post = await prisma.post.findUnique({ where: { slug } });
  return NextResponse.json(post);
}

export default prisma;
