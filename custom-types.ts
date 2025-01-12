export interface IMessage{
    id:string;
    role: 'system' | 'user' | 'bot';
    data:string;
    time:string;
}