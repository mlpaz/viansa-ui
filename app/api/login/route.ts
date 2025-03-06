import { NextRequest, NextResponse } from "next/server";
interface UserLogin {
    email: string;
    password: string;
}
export async function POST(req:NextRequest) {
    const login:UserLogin = await req.json();
    console.log("aca!",login)
    const response = await fetch("http://localhost:8080/api/v1/user/login", {method:"POST", headers: {"Content-Type": "application/json",
    }, body:JSON.stringify(login)});
    const bodyResponse = await response.json();
    console.log("tenemos la respuesta!", bodyResponse);
    return NextResponse.json({});
}