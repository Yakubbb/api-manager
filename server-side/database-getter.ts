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

export async function addNewPathToCollection(nodes: any, edges: any) {
    const user = await getUserIdFromSession()

    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("paths");
    const doc = await collection.insertOne({ author: new ObjectId(user), nodes: nodes, edges: edges })
    return doc.insertedId.toString()
}

export async function getPathFromCollection(id: string) {
    const user = await getUserIdFromSession()

    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("paths");
    const doc: any = await collection.findOne({ _id: new ObjectId(id) })
    return { edges: doc.contents.edges, nodes: doc.contents.nodes, id: doc?._id.toString() }
}

export async function getPathsClean(id: string) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("paths");
    //await collection.updateOne(
    //   { _id: new ObjectId(id)},
    //   { $set: { "chats.$.messages": messages } }
    //);
    return collection
}
