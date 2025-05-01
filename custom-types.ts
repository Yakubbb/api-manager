'use server'

import { ObjectId } from "mongodb"
import { IconType } from "react-icons"
import { IHandleData } from "./diagramComponents/moduleComponent"


export interface IMessage {
    role: 'system' | 'user' | 'model' | 'tool'
    parts: [
        {
            text: string
        }
    ]
    isCreating?: boolean
    error?: string
    model?: string
    person?: string
    time?: string
    temp?: string
}

export interface IUserContext {
    chats: IChat[]
}

export interface BaseElementProps {
    id: string;
    name: string;
    description?: string;
    authorName: string;
    isPrivate: boolean;
    isEditable: boolean;
    onDelete: (id: string) => void;
    onToggleStar: (id: string) => void;
    onTogglePrivacy: (id: string, currentStatus: boolean) => void;
}


export interface ChatZoneProps {
    items?: any[];
    type: 'history' | 'prompt';
    onDelete: (id: string) => void;
    onToggleStar: (id: string) => void;
    onTogglePrivacy: (id: string, currentStatus: boolean) => void;
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
    inputType: string
    endpoint: string
}


export interface IDiagramModule {
    name: string,
    itsEnd?: boolean,
    itsIntegrated?: boolean,
    endpoint?: string,
    getResponse: (args: { id: string, value?: any }[]) => Promise<{ id: string, value?: any }[]>
    inputs: IHandleData[],
    outputs: IHandleData[],
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


export interface IPerson {
    id: ObjectId,
    name: string,
    avatar?: string,
    description?: string
    tags?: ITag[]
}


export interface DataType {
    style: string,
    Icon: IconType
}


export interface ICustomItem {
    _id: ObjectId
    photo?: string,
    type: 'prompt' | 'systemPrompt' | 'history' | 'module'
    name: string,
    description: string,
    comments?: any[]
    likes: ObjectId[]
    isPrivate: boolean
    authorId: ObjectId
    contents: any
}
export interface ICustomItemForFront {
    _id: string
    photo?: string,
    type: 'prompt' | 'systemPrompt' | 'history' | 'module'
    name: string,
    description: string,
    comments?: any[]
    likes: string[]
    isPrivate: boolean
    authorId: string
    contents: any

}


