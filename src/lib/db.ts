import { log } from "console";
import mongoose, { mongo } from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI!;

if(!MONGODB_URI){
    throw new Error("Please provide mongodb uri in env file.")
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        const opts = {
            bufferCommmands: true,
            maxPoolSize: 5,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then(() => mongoose.connection)

    }

    try {
        cached.conn = await cached.promise;
        console.log(cached.conn);
        
    } catch (error) {
        cached.promise = null;
        console.log("Check connection db.ts file", error);
    }

    return cached.conn;

}