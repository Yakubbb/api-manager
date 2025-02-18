'use server'

import { ObjectId } from "mongodb"
import { IconType } from "react-icons"

export interface IMessage {
    role: 'system' | 'user' | 'model' | 'tool'
    parts: [
        {
            text: string
        }
    ]
}

export interface IUserContext {
    chats: IChat[]
}


export interface IChat {
    _id: ObjectId
    ai: 'gemini' | 'gpt' | 'other'
    model: string
    name: string
    desription: string
    messages: IMessage[]
}

export interface ISidebarChildren {
    name: string
    href: string
    Icon: IconType
}

export interface IUser {
    _id: ObjectId,
    name: string,
    password: string,
    chats: IChat[]
}

export interface IChatForFront {
    _id: string,
    ai: 'gemini' | 'gpt' | 'other'
    model: string
    name: string
    desription: string
    messages: IMessage[]
}

export interface IModel {
    name: string,
    modelName: string,
    thinking: boolean
}

export interface IHistory {
    name: string,
    history: IMessage[]
}

export interface IApi {
    _id: ObjectId
    isOficial: boolean
    tags?: ObjectId[]
    creatorId: ObjectId
    name: string
    prewviewPhoto?: string
    descPhotos?: string[]
    description?: string
    color?: string
    inputType: 'text' | 'Fbx' | 'Photo'
    endpoint: string
}


export interface ITag {
    _id: string
    name: string,
    color: string
}

export interface IUserDisplayInfo {
    id: string,
    name: string,
    avatar?: string
    accesLevels?: string[],
}

