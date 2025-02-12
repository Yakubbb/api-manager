'use client'
import { ChatBlock } from "@/components/chat-block";
import { IChat, IChatForFront, IMessage, IModel } from "@/custom-types";
import { ModelOptionsBar } from "@/components/model-options-bar";
import { useEffect, useState } from "react";

import { useSearchParams } from 'next/navigation'
import { getChatById } from "@/server-side/database-handler";
import getAvalibleModels from "@/server-side/chat-handler";



const messages = [
  {
    role: 'user',
    parts: ['aboba'],
    time: '11:02',
    modelTime: 3.3,
    serverTime: 5.3,
    name: 'YD'
  },
  {
    role: 'model',
    parts: ['boba'],
    time: '11:02',
    modelTime: 3.3,
    serverTime: 5.3,
    name: 'gpt-3.5'
  },
] as IMessage[]

const chatt = {
  ai: 'gemini',
  model: 'gemini-pro',
  name: 'Пример названия чата с Gemini',
  desription: 'описание 1',
  messages: messages
} as IChat

const modelss = [
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

export default function Home() {

  const searchParams = useSearchParams()
  const chatId = searchParams.get('id')

  const [chat, setChat] = useState<IChatForFront>()
  const [models, setModels] = useState<IModel[]>()


  useEffect(() => {
    const fetchData = async () => {
      const models = await getAvalibleModels()
      const recivedChat = await getChatById(chatId || '');
      if (recivedChat) {
        setChat(recivedChat)
      }
    }
    fetchData()
  }, [searchParams]);

  return (
    <section className="flex flex-row w-[85%] gap-4">
      <ChatBlock id="1" chat={chat} isReadonly={false} />
      <ModelOptionsBar avalibleModels={models} />
    </section>
  );
}
