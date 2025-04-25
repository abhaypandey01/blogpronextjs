import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(){
    try {
        await connectToDatabase();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

        if(!videos || videos.length === 0){
            return NextResponse.json(
                [],
                {status: 200}
            )
        }
        return NextResponse.json(videos);

    } catch (error) {
        return NextResponse.json(
            {error: "Error in fetching videos from database."},
            {status: 500}
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = getServerSession(authOptions);

        if(!session){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status: 401}
            )
        }

        await connectToDatabase();
        const body: IVideo = await request.json();
        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error:"Mssing required fields."},
                {status: 400}
            )
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: body.transformation?.height ?? 1920,
                width: body.transformation?.width ?? 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newvideo = await Video.create(videoData);
        return NextResponse.json(newvideo);

    } catch (error) {
        return NextResponse.json(
            {error:"Couldnt upload video."},
            {status: 500}
        )
    }
}