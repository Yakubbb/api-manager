'use server'
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