'use server'
import { ICustomItem, ICustomItemForFront, IDiagramModule } from "@/custom-types";
import { MongoClient, ObjectId } from "mongodb";
import { getUserFromSession } from "./database-handler";
import { redirect } from "next/navigation";

const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri)
const database = client.db('api-manager')


export interface ICustomItemForUser {
    item: ICustomItemForFront
    isEditable: boolean,
    isLiked: boolean,
    authorName: string

}

export async function togglePrivateCustomItem(itemId: string, itemType: 'prompt' | 'systemPrompt' | 'history') {
    const collectionName = itemType == 'history' ? 'histories' : 'prompts'
    const collection = database.collection<ICustomItem>(collectionName)
    const state = await collection.findOne({ _id: new ObjectId(itemId) })

    if (state) {
        if (state.isPrivate) {
            await collection.updateOne({ _id: new ObjectId(itemId) }, { '$set': { 'isPrivate': false } })
        }
        else {
            await collection.updateOne({ _id: new ObjectId(itemId) }, { '$set': { 'isPrivate': true } })
        }
    }
}


export async function deleteCustomItem(itemId: string, itemType: 'prompt' | 'systemPrompt' | 'history') {
    const collectionName = itemType == 'history' ? 'histories' : 'prompts'
    const collection = database.collection(collectionName)
    await collection.deleteOne({ _id: new ObjectId(itemId) })
}

export async function likeCustomItem(itemId: string, itemType: 'prompt' | 'systemPrompt' | 'history') {

    const user = await getUserFromSession()

    const collectionName = itemType == 'history' ? 'histories' : 'prompts'
    const collection = database.collection<ICustomItem>(collectionName)

    const state = await collection.findOne({ _id: new ObjectId(itemId) })

    if (state?.likes.find(l => l.toString() == user?._id.toString())) {
        await collection.updateOne({ _id: new ObjectId(itemId) }, { '$set': { 'likes': state?.likes.filter(l => l.toString() != user?._id.toString()) } })
    }
    else {
        await collection.updateOne({ _id: new ObjectId(itemId) }, { '$set': { 'likes': [...state!.likes, user?._id!] } })
    }
}


export async function createCustomItem(itemType: 'prompt' | 'systemPrompt' | 'history', item: ICustomItem) {
    const collectionName = itemType == 'history' ? 'histories' : 'prompts'
    const collection = database.collection(collectionName)
    const user = await getUserFromSession()
    item.authorId = user?._id!
    const result = await collection.insertOne(item)
    console.log(result)
    redirect(`/main/customs/${collectionName}/${result.insertedId.toString()}`)

}

export async function updateCustomItem(itemType: 'prompt' | 'systemPrompt' | 'history', item: any, itemId: string) {
    const collectionName = itemType == 'history' ? 'histories' : 'prompts'
    const user = await getUserFromSession()
    const collection = database.collection<ICustomItem>(collectionName)
    delete item._id
    item.authorId = user?._id!
    await collection.replaceOne({ _id: new ObjectId(itemId) }, item)
}


export async function getAllModules(): Promise<{ id: string, data: IDiagramModule }[]> {

    const user = await getUserFromSession()
    const modules = await database.collection<ICustomItem>('modules').find().toArray()

    const modulesPromises = modules.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const resolvedModules = await Promise.all(modulesPromises);

    return resolvedModules.map(m => ({ id: m.item._id, data: m.item.contents }))

}

export async function getAllCustomIems(byUser: boolean): Promise<ICustomItemForUser[]> {

    const user = await getUserFromSession()

    const filter = {}

    const prompts = await database.collection<ICustomItem>('prompts').find(filter).toArray()
    const histories = await database.collection<ICustomItem>('histories').find(filter).toArray()



    const promptPromises = prompts.map(p => {
        return convertCustomItem(p, user?._id!);
    });



    const historiesPromises = histories.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const resolvedPrompts = await Promise.all(promptPromises);
    const resolvedHistories = await Promise.all(historiesPromises);

    const answer = resolvedHistories.concat(resolvedPrompts).filter(
        i => {
            if (i.item.authorId == user?._id.toString()) {
                console.log('a')
                return (true)
            }
            else if (i.item.isPrivate == false) {
                console.log('a')
                return (true)
            }
            else {
                console.log('b')
                return (false)
            }

        }
    )
    return answer

}

export async function convertCustomItem(item: ICustomItem, userId: ObjectId) {

    const itemForFront: ICustomItemForFront = {
        _id: item._id.toString(),
        name: item.name,
        authorId: item.authorId.toString(),
        type: item.type,
        description: item.description,
        likes: item.likes.map(l => l.toString()),
        isPrivate: item.isPrivate,
        contents: item.contents
    }
    const author = await database.collection<{ name: string }>('users').findOne({ _id: item.authorId })

    const authorName = author ? author.name : 'аккаунт удалён'
    const isLikedByUser = item.likes.find(l => l.toString() == userId.toString()) ? true : false
    const isEditable = item?.authorId.toString() == userId.toString()

    return (
        {
            item: itemForFront,
            isEditable: isEditable,
            authorName: authorName,
            isLiked: isLikedByUser
        }
    )
}


export async function getCustomItem(collectionName: 'prompts' | 'histories' | 'modules', id: string): Promise<ICustomItemForUser | undefined> {
    const collection = database.collection<ICustomItem>(collectionName)
    const user = await getUserFromSession()

    const item = await collection.findOne({ _id: new ObjectId(id) })
    if (item) {
        const itemForFront: ICustomItemForFront = {
            _id: item._id.toString(),
            name: item.name,
            authorId: item.authorId.toString(),
            type: item.type,
            description: item.description,
            likes: item.likes.map(l => l.toString()),
            isPrivate: item.isPrivate,
            contents: item.contents
        }

        const author = await database.collection<{ name: string }>('users').findOne({ _id: item.authorId })

        const authorName = author ? author.name : 'аккаунт удалён'
        const isLikedByUser = item.likes.find(l => l.toString() == user?._id.toString()) ? true : false
        const isEditable = item?.authorId.toString() == user?._id.toString()

        return (
            {
                item: itemForFront,
                isEditable: isEditable,
                authorName: authorName,
                isLiked: isLikedByUser
            }
        )
    }
}