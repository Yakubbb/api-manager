'use server'
import { Collection, MongoClient, ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashSync, genSaltSync, compareSync } from "bcrypt-ts";
import { getUserIdFromSession } from "./database-getter";
import { IApi, IChat, ITag, IUser } from "@/custom-types";
import { convertIChatforFront } from "./chat-handler";




const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri);

export async function getUserFromSession() {

    const database = client.db('api-manager')
    const collection = database.collection('users')
    const user = await collection.findOne({ _id: new ObjectId(await getUserIdFromSession()) })
    return user
}

export async function addNewModule(module: IApi) {
    const database = client.db('api-manager')
    const collection: Collection<IApi> = database.collection('modules')
    collection.insertOne(module)
}

export async function getAllTags() {
    const database = client.db('api-manager')
    const collection: Collection<{ _id: ObjectId, name: string, color: string }> = database.collection('tags')
    const frontTags: ITag[] = []
    const allTags = await collection.find().toArray()
    allTags.forEach((tag) => {
        frontTags.push({
            _id: tag._id.toString(),
            name: tag.name,
            color: tag.color
        })
    })
    return frontTags
}

export async function getAllUsersChats() {
    const database = client.db('api-manager')
    const collection: Collection<{
        chats: IChat[]
    }> = database.collection('users')
    return collection
}

export async function getChatForFrontById(id: string) {

    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("users");

    const userWithChat = await collection.findOne(
        {
            'chats._id': new ObjectId(id)
        }
    ) as IUser

    const chat = userWithChat.chats.find((chat) => chat._id.toString() == id)
    if (chat) {
        return await convertIChatforFront(chat);
    }
    else {
        return undefined
    }

}

export async function getRudePersons() {
    client.connect()
    const database = client.db("api-manager");
    const collection = (await database.collection("persons").find().toArray()).map(person => {
        return (
            {
                _id: person._id.toString(),
                name: person.name,
                description: person.description,
                history: person.history
            }
        )
    });
    console.log(collection)
    return collection
}



export async function getUserIdByCredentials(login: string, password: string) {

    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("users");
    const allData = await collection.findOne({ name: login });

    if (allData?._id && compareSync(password, allData?.password)) {
        return allData?._id.toString()
    }
    return null
}

export async function createSession(userID: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("sessions");

    const data = await collection.insertOne({
        "user": userID,
        "expiresAt": expiresAt
    })

    const session = data.insertedId.toString()

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: false,
        expires: expiresAt,
        sameSite: 'strict',
        path: '/',
    })

    console.log(cookieStore)

}


export async function validateUserCreds(state: any, formData: FormData) {
    const login = formData.get('login')?.toString()
    const password = formData.get('password')?.toString()

    if (!login || !password) {
        return { type: 'error', msg: 'введите логин и пароль' }
    }
    const userId = await getUserIdByCredentials(login, password)
    if (userId) {
        await createSession(userId)
        redirect('/main/')
    }
    return { type: 'error', msg: 'Пользователя с такими данными нет' }
}

export async function validateCookie(sessionId: string) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("sessions");

    const allData = await collection.findOne({ _id: new ObjectId(sessionId) });

    if (allData) {
        return true
    }
    return false;

}

export async function createUser(state: any, formData: FormData) {

    const login = formData.get('login')?.toString()
    const password = formData.get('password')?.toString()

    if (!password || !login) {
        return { type: 'error', msg: 'Введите логин и пароль' }
    }


    const hashedPassword = hashSync(password, genSaltSync(10))

    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("users");

    const user = await collection.findOne({ name: login });
    if (user) {
        return { type: 'error', msg: 'Пользователь с таким логином уже существует' }
    }

    const data = await collection.insertOne({
        "name": login,
        "password": hashedPassword,
        "chats": []
    })


    console.log(`new user ${data}`)
    return { type: 'ok', msg: 'Аккаунт успешно создан' }

}