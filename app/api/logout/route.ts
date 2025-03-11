import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(rec:NextRequest) {
    const cookieMng = await cookies();
    await cookieMng.delete("session");
    return NextResponse.json({})
    
}