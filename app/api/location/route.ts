import { siteConfig } from "@/config/site";
import { Stock, UserLogin, UserLoginResponse } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieMng = cookies();
  const searchName = req.nextUrl.searchParams.get("name");
  const page = req.nextUrl.searchParams.get("page") || "0";
  const rows = req.nextUrl.searchParams.get("rows") || "10";
  let url = `/api/v1/locations?page=${page}&limit=${rows}`;
  if (searchName) {
    url = `${url}&name=${searchName}`;
  }
  const session: UserLoginResponse = JSON.parse(
    (await cookieMng).get("session")?.value || "{}"
  );
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
