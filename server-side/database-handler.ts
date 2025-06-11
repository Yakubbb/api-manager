'use server'
import { Collection, MongoClient, ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashSync, genSaltSync, compareSync } from "bcrypt-ts";
import { getUserIdFromSession } from "./database-getter";
import { IApi, IChat, ITag, IUser } from "@/custom-types";
import { convertIChatforFront } from "./chat-handler";
import { ChatState } from "@/components/history-configure";
import { PromptState } from "@/components/promptConfig";
import { writeFile, access } from "fs/promises";
import path from "path";




const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri);

export async function getUserFromSession() {

    const database = client.db('api-manager')
    const collection = database.collection('users')
    const user = await collection.findOne({ _id: new ObjectId(await getUserIdFromSession()) })
    return user
}

export async function getUserPhotoById(id: string) {
    const avatarPath = path.join(process.cwd(), 'public', 'avatars', `${id}.png`);
    let image: string;
    try {
        await access(avatarPath)
        image = `/avatars/${id}.png`;
    } catch (error) {
        image = '/avatars/placeholder.png';
    }
    return image
}

export async function deleteUser(id: string) {
    const database = client.db('api-manager');
    const collection = database.collection('users');
    const admin = await getUserDataForFront()
    const users = await getAllUsersForFront()
    const userToDelete = users.find(u => u.id == id)

    if (userToDelete?.role == 'admin') {
        if (admin.role == 'system') {
            await collection.deleteOne({ _id: new ObjectId(userToDelete.id) })
            return true
        }
        else {
            return false
        }
    }
    if (userToDelete?.role == 'user') {
        if (admin.role == 'admin' || admin.role == 'system') {
            await collection.deleteOne({ _id: new ObjectId(userToDelete.id) })
            return true
        }
        else {
            return false
        }
    }
}


export async function getAllUsersForFront() {
    const database = client.db('api-manager');
    const collection = database.collection('users');
    const users = await collection.find().toArray();

    let usersForFront = [];

    for (const user of users) {

        const role = user.role || 'user';
        const name = user.name as string;
        const email = user.email as string;
        let image = await getUserPhotoById(user?._id.toString());

        usersForFront.push({
            role: role,
            name: name,
            email: email,
            image: image,
            id: user?._id.toString(),
        });

    }

    return usersForFront;
}

export async function getUserDataForFront() {
    const user = await getUserFromSession() as any;

    const role = user.role as string;
    const name = user.name as string;
    const email = user.email as string;
    let image = await getUserPhotoById(user?._id.toString())

    return { role: role, name: name, email: email, image: image, id: user?._id.toString() };
}

export async function updateUserData(name: string, email: string, image?: File) {
    const database = client.db('api-manager')
    const user = await getUserFromSession()

    if (image) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `${user?._id.toString()}.png`;
        await writeFile(
            path.join(process.cwd(), "public/avatars/" + filename),
            buffer
        );
    }


    database.collection('users').updateOne({ _id: user?._id }, { $set: { name: name, email: email } })

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

export async function addNewHistory(history: ChatState) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("histories");
    const user = await getUserFromSession()
    const userID = user?._id
    if (userID) {
        const data = await collection.insertOne({
            ...history, author: userID
        })
    }
}

export async function addNewPrompt(prompt: PromptState) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("prompts");
    const user = await getUserFromSession()
    const userID = user?._id
    if (userID) {
        const data = await collection.insertOne({
            ...prompt, author: userID
        })
    }
}

export async function deletePrompt(promptId: string) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("prompts");
    await collection.deleteOne({ _id: new ObjectId(promptId) })
}

export async function deleteHistory(historyId: string) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("histories");
    await collection.deleteOne({ _id: new ObjectId(historyId) })
}

export async function changeHistoryPrivacy(historyId: string, status: boolean) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("histories");
    await collection.updateOne({ _id: new ObjectId(historyId) }, {
        $set: {
            isPrivate: status,
        },
    })
}

export async function changePromptPrivacy(promptId: string, status: boolean) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("prompts");
    await collection.updateOne({ _id: new ObjectId(promptId) }, {
        $set: {
            isPrivate: status,
        },
    })
}


export async function getPrompts(onlyYours: boolean) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("prompts");

    let histories: any = undefined
    const sessionUser = await getUserFromSession()
    const userId = sessionUser?._id.toString()

    if (onlyYours) {

        histories = await collection.find({ 'author': new ObjectId(userId) })
    }
    else {
        histories = await collection.find({ 'isPrivate': false })
    }

    const foundedHistories = await histories.map(
        (h: {
            _id: any;
            promptName: any;
            promptDescription: any;
            promptText: any;
            isPrivate: any;
            isSystemPrompt: any;
            author: { toString: () => any; };
        }) => {
            return (
                {
                    id: h._id.toString(),
                    promptName: h.promptName,
                    promptDescription: h.promptDescription,
                    promptText: h.promptText,
                    isPrivate: h.isPrivate,
                    isSystemPrompt: h.isSystemPrompt,
                    author: h.author.toString()
                }
            )
        }).toArray()

    let aboba: any[] = []


    aboba = await Promise.all(foundedHistories.map(async (h: { author: string; }) => {

        return {
            ...h,
            authorName: await getUserNameById(h.author),
            isEditable: h.author == userId,
        };
    }));

    return aboba
}



export async function getHistories(onlyYours: boolean) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("histories");

    let histories: any = undefined
    const userId = await getUserIdFromSession()
    if (onlyYours) {

        histories = await collection.find({ 'author': new ObjectId(userId) })
    }
    else {
        histories = await collection.find({ 'isPrivate': false })
    }

    const foundedHistories = await histories.map(
        (h: {
            _id: any; historyName: any; historyDescription: any; messages: any; isPrivate: any; author: { toString: () => any; };
        }) => {
            return (
                {
                    id: h._id.toString(),
                    historyName: h.historyName,
                    historyDescription: h.historyDescription,
                    messages: h.messages,
                    isPrivate: h.isPrivate,
                    author: h.author.toString()
                }
            )
        }).toArray()

    let aboba: any[] = []


    aboba = await Promise.all(foundedHistories.map(async (h: { author: string; }) => {
        return {
            ...h,
            authorName: await getUserNameById(h.author),
            isEditable: h.author == userId
        };
    }));

    return aboba
}

export async function getUserNameById(id: string) {
    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("users");
    const user = await collection.findOne({ _id: new ObjectId(id) })
    if (user) {
        return user.name
    }
    else {
        return 'аккаунт удален'
    }
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
        redirect('/main/gemini')
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
        "image": '',
        'email': '',
        "chats": []
    })


    console.log(`new user ${data}`)
    return { type: 'ok', msg: 'Аккаунт успешно создан' }

}