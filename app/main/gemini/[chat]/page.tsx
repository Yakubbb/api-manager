'use client'
import { ChatBlock } from "@/components/chat-block";
import { IChat, IChatForFront, IMessage, IModel } from "@/custom-types";
import { ModelOptionsBar } from "@/components/model-options-bar";
import { useEffect, useState } from "react";

import { useSearchParams } from 'next/navigation'
import { getChatForFrontById } from "@/server-side/database-handler";
import getAvalibleModels from "@/server-side/chat-handler";

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

  const [chat, setChat] = useState<IChatForFront>()
  const [models, setModels] = useState<IModel[]>()


  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get('id')
      if (id) {
        const models = await getAvalibleModels()
        const recivedChat = await getChatForFrontById(id);
        if (recivedChat) {
          setChat(recivedChat)
          setModels(models)
        }
      }

    }
    fetchData()
  }, [searchParams]);

  return (
    <section className="flex h-[100%] ">
      {chat && <ChatBlock chat={chat} avalibleModels={models} />}
    </section>
  );
}
