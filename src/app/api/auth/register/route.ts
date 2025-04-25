import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { error } from "console";

export async function POST(request: NextRequest){

    try {
        const {email, password} = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {error: "Email and password are required."},
                {status: 400}
            )
        }

        await connectToDatabase()

        const existedUser = await User.findOne({email})

        if(existedUser){
            return NextResponse.json(
                {error: "Email already in use."},
                {status: 400}
            )
        }

        await User.create({email, password})

        return NextResponse.json(
            {message: "User registered successfully"},
            {status: 201}
        )
    } catch (error) {
        return NextResponse.json(
            {error: "registration failed path:api/auth/register."},
            {status: 500}
        )
    }
}

//testing
