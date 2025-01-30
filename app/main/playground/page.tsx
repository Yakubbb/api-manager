import Image from "next/image";
import { ChatBlock } from "@/components/chat-block";
import { IMessage } from "@/custom-types";
import { ModelOptionsBar } from "@/components/model-options-bar";
import GetAllUsers from "@/server-side/database-handler";

GetAllUsers()

const messages = [
  {
    id: '1',
    role: 'user',
    data: 'aboba',
    time: '11:02',
    modelTime: 3.3,
    serverTime: 5.3,
    name:'YD'
  },
  {
    id: '2',
    role: 'bot',
    data: 'boba',
    time: '11:02',
    modelTime: 3.3,
    serverTime: 5.3,
    name:'gpt-3.5'
  },
] as Array<IMessage>

//        <ModelOptionsBar/>
export default function Home() {
  return (
      <section className="flex flex-row h-[100%] w-[80%] gap-5 shrink-0 grow-0">
        <ChatBlock id="1" history={messages} isReadonly={false} />
      </section>
  );
}
