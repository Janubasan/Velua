import { NextResponse } from "next/server";
import { buildNotionExports } from "@/lib/notion";

export async function GET() {
  const arquivos = buildNotionExports();
  return NextResponse.json({ arquivos });
}
