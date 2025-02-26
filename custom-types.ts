'use server'

import { ObjectId } from "mongodb"
import { IconType } from "react-icons"
import { MdPhotoSizeSelectActual } from "react-icons/md"
import { TbHexagon3D } from "react-icons/tb"
import { TiDocumentText } from "react-icons/ti"
import { CgKey } from "react-icons/cg";

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
    inputType: string
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


export interface IPerson {
    id: ObjectId,
    name: string,
    avatar?: string,
    description?: string
    tags?: ITag[]
}


export interface IDiagramModule {
    name: 'aboba',
    inputs: {
        name: string,
        type: string
        value?: any
    }[],
    outputs:
    {
        name: string,
        type: string
        value?: any
    }[],
}

export interface DataType {
    style: string,
    Icon: IconType
}


