'use server'

import { ObjectId } from "mongodb"

export interface IMessage{
    role: 'system' | 'user' | 'model'
    parts:string[]
    time:string
    modelTime:number
    serverTime:number
    name:string
}

export interface IUserContext{
    chats:IChat[]
}


export interface IChat{
    _id:ObjectId
    ai:'gemini'|'gpt'|'other'
    model:string
    name:string
    desription:string
    messages:IMessage[]
}

export interface ISidebarChildren{
    name:string
    href:string
}

export interface IUser {
    _id:ObjectId,
    name: string,
    password:string,
    chats:IChat[]
}


export interface IChatForFront{
    _id:string,
    ai:'gemini'|'gpt'|'other'
    model:string
    name:string
    desription:string
    messages:IMessage[]
}

export interface IModel{
    name:string,
    modelName:string,
    thinking:boolean
}

export interface IHistory{
    name:string,
    history:IMessage[]
}

export interface IApi{
    name:string
}