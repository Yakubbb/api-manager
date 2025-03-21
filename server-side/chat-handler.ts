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
            name: 'gemini-1.5-pro',
            modelName: 'gemini-1.5-pro'
        },
        {
            name: 'gemini-1.5-flash',
            modelName: 'gemini-1.5-flash'
        },
        {
            name: 'gemini-2.0-flash',
            modelName: 'gemini-2.0-flash'
        },
        {
            name: 'gemini-2.0-flash-lite',
            modelName: 'gemini-2.0-flash-lite'
        },
        {
            name: 'gemini-2.0-pro-exp-02-05',
            modelName: 'gemini-2.0-pro-exp-02-05'
        },
        {
            name: 'gemini-1.5-flash-8b',
            modelName: 'gemini-1.5-flash-8b'
        }
    ] as IModel[];

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

export async function addMessageToChat(chatId: string, messages: IMessage[]) {

    const chats = await getAllUsersChats()
    const user = await getUserFromSession()
    console.log(user)

    messages.forEach(message => {
        console.log(message)
        chats.updateOne({ _id: user?._id }, { $push: { "chats.$[chat].messages": message } }, { arrayFilters: [{ "chat._id": new ObjectId(chatId) }] })
    })
}

export async function updateChatHistory(chatId: string, messages: IMessage[]) {
    const chats = await getAllUsersChats();
    const user = await getUserFromSession();

    if (!user || !chats) return;

    try {
        await chats.updateOne(
            { _id: new ObjectId(user._id), "chats._id": new ObjectId(chatId) },
            { $set: { "chats.$.messages": messages } }
        );
    } catch (error) {
        console.error("Error updating chat history:", error);
    }
}

export async function changeChatName(chatId: string, newName: string) {

    const chats = await getAllUsersChats()
    const user = await getUserFromSession()
    console.log(user)
    chats.updateOne({ _id: user?._id }, { $push: { "chats.$[chat].name": newName } }, { arrayFilters: [{ "chat._id": new ObjectId(chatId) }] })
}


export async function deleteChat(chatId: string) {
    const chats = await getAllUsersChats()
    const user = await getUserFromSession()
    chats.updateOne({ _id: user?._id }, { $pull: { "chats": { "_id": new ObjectId(chatId) } } })
}

