import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../prisma/db";
import { NextRequest, NextResponse } from "next/server";

export type Context = {
  prisma: PrismaClient;
};

export async function createContext(req: NextRequest) {
  return {
    req,
    prisma,
  };
}
