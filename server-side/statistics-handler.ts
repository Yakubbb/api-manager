'use server'
import { updateChatHistory } from "./chat-handler"
import { getAllCustomIems, getAllUsersPaths } from "./custom-items-database-handler"
import { getAllPaths, getAllUsersChats, getUserFromSession } from "./database-handler"

export interface PathStatistics {
    id: string,
    name: string,
    uniqueUsers: string[], // Предполагаем массив ID пользователей
    usesCount: number,
    errors: string[] // Предполагаем массив строк ошибок, если ошибки уникальны
}


export async function getUserPathsStats(): Promise<PathStatistics[]> {
    const paths = await getAllUsersPaths()
    const pathStatistics = paths.map(p => {
        const element: PathStatistics = {
            id: p._id.toString(),
            name: p.name,
            uniqueUsers: p.contents.pathStatistics.uniqueUsers || [], // Добавляем || [] на случай, если поле может быть undefined
            errors: p.contents.pathStatistics.errors || [], // Добавляем || []
            usesCount: p.contents.pathStatistics.usesCount || 0, // Добавляем || 0
        }
        return element
    })
    return pathStatistics
}

export async function updateStatistics(id: string) {
    const paths = await getAllPaths();
    const user = await getUserFromSession();
    /*
        try {
            await paths.updateOne(
                { _id: new ObjectId(user._id), "chats._id": new ObjectId(chatId) },
                { $set: { "chats.$.messages": messages } }
            );
        } catch (error) {
            console.error("Error updating chat history:", error);
        }
    */
}