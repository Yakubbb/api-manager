'use server'
import { IChat, IMessage } from "@/custom-types";
import { MongoClient, ObjectId } from "mongodb";
import { getUserFromSession, getUsersCollection } from "./database-handler";


const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri);

export async function createChat(ai: string = '', model: string = '') {
    const user = await getUserFromSession()
    const newChat = {
        name: `Чат с ${model}`,
        ai: ai,
        model: model,
    } as IChat

    const users = await getUsersCollection()
    const createdChat = await users.updateOne({ _id: user?._id }, { $push: { chats: newChat } })
    return createdChat

}