import { siteConfig } from "@/config/site";
import { Stock, UserLogin, UserLoginResponse } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieMng = cookies();
  const searchName = req.nextUrl.searchParams.get("name");
  const page = req.nextUrl.searchParams.get("page") || "0";
  const rows = req.nextUrl.searchParams.get("rows") || "10";
  let url = `/api/v1/client?page=${page}&limit=${rows}`;
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

export async function POST(req: NextRequest) {
  const cookieMng = cookies();
  const session: UserLoginResponse = JSON.parse(
    (await cookieMng).get("session")?.value || "{}"
  );
  const body: Stock = await req.json();
  let method = "POST";
  if (body.id) {
    method = "PUT";
  }
  const response = await fetch(siteConfig.apiBaseUrl + "/api/v1/client", {
    method,
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
