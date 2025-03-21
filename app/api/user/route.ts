import { siteConfig } from "@/config/site";
import { UserLogin, UserLoginResponse } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieMng = cookies();
  const searchEmail = req.nextUrl.searchParams.get("email");
  const page = req.nextUrl.searchParams.get("page") || "0";
  const rows = req.nextUrl.searchParams.get("rows") || "10";
  let url = `/api/v1/user?page=${page}&limit=${rows}`;
  if (searchEmail) {
    url = `${url}&email=${searchEmail}`;
  }
  const session: UserLoginResponse = JSON.parse(
    (await cookieMng).get("session")?.value || "{}"
  );
  console.info("token", session.token);
  const response = await fetch(siteConfig.apiBaseUrl + url, {
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
