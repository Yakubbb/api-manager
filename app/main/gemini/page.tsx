import Image from "next/image";
import { ChatBlock } from "@/components/chat-block";
import { IChat, IMessage, IUserContext } from "@/custom-types";
import { ModelOptionsBar } from "@/components/model-options-bar";
import { getUserData, getUserIdFromSession } from "@/server-side/database-handler";
import { cookies } from "next/headers";



const messages = [
  {
    id: '1',
    role: 'user',
    parts: ['aboba'],
    time: '11:02',
    modelTime: 3.3,
    serverTime: 5.3,
    name: 'YD'
  },
  {
    id: '2',
    role: 'model',
    parts: ['boba'],
    time: '11:02',
    modelTime: 3.3,
    serverTime: 5.3,
    name: 'gpt-3.5'
  },
] as IMessage[]

const chat = {
  ai:'gemini',
  model:'gemini-pro',
  name: 'Пример названия чата с Gemini',
  desription: 'описание 1',
  messages: messages
} as IChat

const models = [
  {
    name: 'Gemini-2.0-flash-exp',
    description: 'aboba',
    value: 'models/gemini-2.0-flash-exp'
  },
  {
    name: 'Gemini-pro',
    description: 'aboba',
    value: 'models/gemini-pro'
  }
]

//        <ModelOptionsBar/>
export default async function Home() {

  return (
    <section className="flex flex-row w-[85%] gap-4">
      <ChatBlock id="1" chat={chat} isReadonly={false} />
      <ModelOptionsBar avalibleModels={models} />
    </section>
  );
}
