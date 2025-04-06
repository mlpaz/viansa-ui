import { siteConfig } from "@/config/site";
import { UserLogin, UserLoginResponse } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieMng = cookies();
  const session: UserLoginResponse = JSON.parse(
    (await cookieMng).get("session")?.value || "{}"
  );
  const response = await fetch(
    siteConfig.apiBaseUrl + `/api/v1/user/${params.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );
  if (!response.ok) {
    return NextResponse.json(
      { message: "Invalid Email or Password" },
      { status: 401 }
    );
  }
  const data = await response.json();
  return NextResponse.json(data);
}
