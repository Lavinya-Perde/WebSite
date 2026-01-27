import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    const { USER, PASSWORD } = process.env;
    const { email, password } = await request.json();
    
    if (email === USER && password === PASSWORD) {
        const token = jwt.sign({ email }, "secret", { expiresIn: "30d" });
        return NextResponse.json({ token }, { status: 200 });
    } else {
        return NextResponse.json(
            { error: "Hatalı kullanıcı adı veya şifre" }, 
            { status: 401 }
        );
   }
}