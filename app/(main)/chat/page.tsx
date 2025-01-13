import Image from "next/image";
import { ChatBlock } from "@/components/chat-block";
import { IMessage } from "@/custom-types";
import { MainHeader } from "@/components/header-main";
import { SideBar } from "@/components/sidebar";
import { ModelOptionsBar } from "@/components/model-options-bar";

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
//<MainHeader/>
export default function Home() {
  return (
    <div>
    <main className="flex flex-col bg-slate-950 h-dvh overflow-hidden">
      <MainHeader />
      <section className="flex flex-row h-[95%] w-full gap-5 shrink-0 grow-0">
        <SideBar />
        <ChatBlock id="1" history={messages} isReadonly={false} />
        <ModelOptionsBar/>
      </section>
    </main>
    </div>
  );
}
