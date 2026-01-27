import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export default async function POST(request: NextRequest){
    const { USER, PASSWORD } = process.env;
    const { email, password } =  await request.json();
    if(email === USER && password === PASSWORD){
        return new Response(jwt.sign({ email }, "secret", { expiresIn: "30d" }), { status: 200 });
    }else{
        return new Response("Hatalı kullanıcı adı veya şifre", { status: 401 });
    }
}