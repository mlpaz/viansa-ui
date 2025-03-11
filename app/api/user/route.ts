import { siteConfig } from "@/config/site";
import { UserLogin, UserLoginResponse } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieMng = cookies();
  const session: UserLoginResponse = JSON.parse(
    (await cookieMng).get("session")?.value || "{}"
  );
  console.info("token", session.token);
  const response = await fetch(siteConfig.apiBaseUrl + "/api/v1/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });
  if (!response.ok) {
    return NextResponse.json(
      { message: "Invalid Email or Password" },
      { status: 401 }
    );
  }
  const data = await response.json();
  return NextResponse.json(data);
}
