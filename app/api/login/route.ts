import { siteConfig } from "@/config/site";
import { UserLogin, UserLoginResponse } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieMng = await cookies();
  const login: UserLogin = await req.json();
  const response = await fetch(siteConfig.apiBaseUrl + "/api/v1/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login),
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Invalid Email or Password" },
      { status: 401 }
    );
  }

  const bodyResponse: UserLoginResponse = await response.json();
  cookieMng.set("session", JSON.stringify(bodyResponse), {
    httpOnly: true,
    secure: true,
  });

  return NextResponse.json({});
}
