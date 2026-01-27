import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: "Token eksik" }, { status: 400 });
        }

        jwt.verify(token, "secret");
        return NextResponse.json({ message: "Success" }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: "Geçersiz token" }, { status: 401 });
    }
}