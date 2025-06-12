'use server'
import { ICustomItem, ICustomItemForFront, IDiagramModule } from "@/custom-types";
import { MongoClient, ObjectId } from "mongodb";
import { getUserDataForFront, getUserFromSession, getUserPhotoById } from "./database-handler";
import { redirect } from "next/navigation";
import { generate } from "random-words";

const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri)
const database = client.db('api-manager')


function getCustomCollectionByType(type: string) {
    switch (type) {
        case 'history':
            return 'histories'
        case 'prompt':
            return 'prompts'
        case 'module':
            return 'modules'
        case 'systemPrompt':
            return 'prompts'
        case 'path':
            return 'paths'
        default:
            return ''
    }
}


export interface ICustomItemForUser {
    item: ICustomItemForFront
    isEditable: boolean,
    isUserAdmin: boolean,
    isLiked: boolean,
    authorName: string,
    authorPhoto: string
}

export async function togglePrivateCustomItem(itemId: string, itemType: 'prompt' | 'systemPrompt' | 'history' | 'module') {

    const collectionName = getCustomCollectionByType(itemType)

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


export async function deleteCustomItem(itemId: string, itemType: 'prompt' | 'systemPrompt' | 'history' | 'module') {
    const collectionName = getCustomCollectionByType(itemType)
    const collection = database.collection(collectionName)
    await collection.deleteOne({ _id: new ObjectId(itemId) })
}

export async function likeCustomItem(itemId: string, itemType: 'prompt' | 'systemPrompt' | 'history' | 'module') {

    const user = await getUserFromSession()

    const collectionName = getCustomCollectionByType(itemType)


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
    const collectionName = getCustomCollectionByType(itemType)
    const collection = database.collection(collectionName)
    const user = await getUserFromSession()
    item.authorId = user?._id!
    const result = await collection.insertOne(item)
    console.log(result)
    redirect(`/main/customs/${collectionName}/${result.insertedId.toString()}`)

}

export async function updateCustomItem(itemType: 'prompt' | 'systemPrompt' | 'history', item: any, itemId: string) {
    const collectionName = getCustomCollectionByType(itemType)
    const collection = database.collection<ICustomItem>(collectionName)
    delete item._id
    item.authorId = new ObjectId(item.authorId)
    await collection.replaceOne({ _id: new ObjectId(itemId) }, item)
}


export async function getAllModules(): Promise<{ id: string, data: IDiagramModule, type: string }[]> {

    const user = await getUserFromSession()
    const modules = await database.collection<ICustomItem>('modules').find().toArray()

    const modulesPromises = modules.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const resolvedModules = await Promise.all(modulesPromises);

    return resolvedModules.map(m => ({ id: m.item._id, data: m.item.contents, type: 'module' }))

}

export async function getAllConsts(): Promise<{ id: string, data: IDiagramModule, type: string }[]> {

    const user = await getUserFromSession()

    const histories = await database.collection<ICustomItem>('histories').find().toArray()
    const prompts = await database.collection<ICustomItem>('prompts').find().toArray()

    const historiesPromises = histories.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const promptsPromises = prompts.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const resolvedHistories = await Promise.all(historiesPromises);
    const resolvedPrompts = await Promise.all(promptsPromises);

    const historiesModules: { id: string, data: IDiagramModule, type: string }[] = resolvedHistories.map(h => {
        return ({
            id: h.item._id,
            data: {
                name: h.item.name,
                getResponse: {},
                inputs: [],
                outputs: [
                    {
                        id: `${generate()}-${Date.now()}`,
                        name: 'value',
                        type: 'history',
                        value: h.item.contents,
                        showValue: false
                    },
                ]
            },
            type: h.item.type
        })

    }) as { id: string, data: IDiagramModule, type: string }[]

    const promptsModules: { id: string, data: IDiagramModule, type: string }[] = resolvedPrompts.map(h => {
        return ({
            id: h.item._id,
            data: {
                name: h.item.name,
                getResponse: {},
                inputs: [],
                outputs: [
                    {
                        id: `${generate()}-${Date.now()}`,
                        name: 'value',
                        type: 'text',
                        value: h.item.contents,
                        showValue: false
                    },
                ]
            },
            type: h.item.type
        })

    }) as { id: string, data: IDiagramModule, type: string }[]

    return promptsModules.concat(historiesModules)

}

export async function getAllUsersPaths() {
    const user = await getUserFromSession()
    const paths = await database.collection<ICustomItem>('paths').find({
        'authorId': user?._id
    }).toArray()
    return paths
}

export async function getAllCustomIems(byUser: boolean): Promise<any[]> {

    const user = await getUserFromSession()

    const filter = {}

    const prompts = await database.collection<ICustomItem>('prompts').find(filter).toArray()
    const histories = await database.collection<ICustomItem>('histories').find(filter).toArray()
    const modules = await database.collection<ICustomItem>('modules').find(filter).toArray()
    const paths = await database.collection<ICustomItem>('paths').find(filter).toArray()



    const promptPromises = prompts.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const modulesPromises = modules.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const historiesPromises = histories.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const pathsPromises = paths.map(p => {
        return convertCustomItem(p, user?._id!);
    });

    const resolvedPrompts = await Promise.all(promptPromises);
    const resolvedHistories = await Promise.all(historiesPromises);
    const resolvedModules = await Promise.all(modulesPromises);
    const resolvedPaths = await Promise.all(pathsPromises);

    const answer = resolvedHistories.concat(resolvedPrompts).concat(resolvedModules).concat(resolvedPaths).filter(
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
        contents: item.contents,
        comments: item.comments,
        tags: item.tags
    }
    const author = await database.collection<{ name: string }>('users').findOne({ _id: item.authorId })

    const authorName = author ? author.name : 'аккаунт удалён'
    const authorPhoto = await getUserPhotoById(author ? item.authorId.toString() : '')

    const isLikedByUser = item.likes.find(l => l.toString() == userId.toString()) ? true : false
    const role = (await getUserDataForFront()).role
    const isEditable = item?.authorId.toString() == userId.toString() || (role == 'admin' || role == 'system')

    return (
        {
            item: itemForFront,
            isEditable: isEditable,
            authorName: authorName,
            authorPhoto: authorPhoto,
            isLiked: isLikedByUser
        }
    )
}

export async function getUserNameById(id: string) {
    return (await database.collection<{ name: string }>('users').findOne({ _id: new ObjectId(id) }))?.name || 'аккаунт удалён'
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
            contents: item.contents,
            comments: item.comments,
            tags: item.tags

        }


        const authorName = await getUserNameById(item.authorId.toString())
        const authorPhoto = await getUserPhotoById(item.authorId.toString())
        const isLikedByUser = item.likes.find(l => l.toString() == user?._id.toString()) ? true : false
        const isEditable = item?.authorId.toString() == user?._id.toString()
        const role = (await getUserDataForFront()).role

        return (
            {
                item: itemForFront,
                isEditable: isEditable,
                isUserAdmin: role == 'admin' || role == 'system',
                authorName: authorName,
                authorPhoto: authorPhoto,
                isLiked: isLikedByUser
            }
        )
    }
}