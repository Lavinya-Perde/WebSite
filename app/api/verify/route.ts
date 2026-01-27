import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        // Token'ı doğrula
        jwt.verify(token, "secret");
        
        // Token geçerli
        return NextResponse.json({ valid: true }, { status: 200 });
        
    } catch (error) {
        // Token geçersiz veya süresi dolmuş
        return NextResponse.json({ valid: false }, { status: 401 });
    }
}