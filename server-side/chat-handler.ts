'use server'
import { IChat, IChatForFront, IMessage, IModel } from "@/custom-types";
import { MongoClient, ObjectId } from "mongodb";
import { getUserFromSession, getAllUsersChats } from "./database-handler";
import { redirect } from "next/navigation";


const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri);

export async function createChat(event: any) {
    console.log('aboba')
    const user = await getUserFromSession()
    const messages = [] as IMessage[]
    const newChatId = new ObjectId();

    const newChat = {
        _id: newChatId,
        name: `Новый чат`,
        ai: 'gemini',
        model: 'pro',
        messages: messages
    } as IChat

    const users = await getAllUsersChats()
    const createdChat = await users.updateOne({ _id: user?._id }, { $push: { chats: newChat } })
    console.log(createdChat)
    redirect(`/main/gemini/chat?id=${newChatId.toString()}`)

}

export async function convertIChatforFront(chat: IChat): Promise<IChatForFront> {
    const frontChat = {
        _id: chat._id.toString(),
        name: chat.name,
        ai: chat.ai,
        model: chat.model,
        desription: chat.desription,
        messages: chat.messages
    } as IChatForFront

    return frontChat;
}



export default async function getAvalibleModels(): Promise<IModel[]> {
    const staticModels = [
        {
            name: 'gemini-pro',
            modelName: 'models/gemini-pro'
        },
        {
            name: 'gemini-pro-1.5',
            modelName: 'models/gemini-1.5-pro'
        },
    ] as IModel[]

    return staticModels
}

export async function getChatLinks() {
    const user = await getUserFromSession()
    const users = await getAllUsersChats()
    const userChats = await users.findOne({ _id: user?._id })
    const frontChats = [] as IChatForFront[]

    userChats?.chats.forEach(async (chat) => {
        frontChats.push(await convertIChatforFront(chat))
    })
    return frontChats
}

export async function addMessageToChat(chatId: string, message: IMessage) {

    const chats = await getAllUsersChats()
    const user = await getUserFromSession()
    console.log(user)
    await chats.updateOne({ _id: user?._id }, { $push: { "chats.$[chat].messages": message } }, { arrayFilters: [{ "chat._id": new ObjectId(chatId) }] })



}
