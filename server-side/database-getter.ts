'use server'

import { MongoClient, ObjectId } from "mongodb";
import { cookies } from "next/headers";

const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri);

export async function getUserIdFromSession() {
    
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value
    
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("sessions");

    const session = await collection.findOne({ _id: new ObjectId(sessionId) });

    return session?.user as string

}