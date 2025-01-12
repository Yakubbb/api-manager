import Image from "next/image";
import { Chat } from "@/components/chat-block";
import { IMessage } from "@/custom-types";

const messages = [
  {
    id:'1',
    role: 'user',
    data:'aboba',
    time:'11:02'
  },
  {
    id:'2',
    role: 'bot',
    data:'boba',
    time:'11:02'
  },
  {
    id:'3',
    role: 'user',
    data:'hoba',
    time:'11:02'
  }
] as Array<IMessage>

export default function Home() {
  return (
    <main>
      <Chat id="1" history={messages} isReadonly={false} />
    </main>
  );
}
