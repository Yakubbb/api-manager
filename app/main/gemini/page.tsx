'use server'
import { BiExpandHorizontal } from "react-icons/bi";
import { IChat } from "@/custom-types";
import { TbMoodLookDown } from "react-icons/tb";
import Markdown from "react-markdown";
import Link from "next/link";
import YourChats from "@/components/your-chats";


const chats = [
  {
    name: 'Шутки про смешариков',
    desription: 'Артхаусные шутки про смешариков',
    model: 'gemini-2.0-flash-exp'
  },
  {
    name: 'Шутки про смешариков',
    desription: 'Артхаусные шутки про смешариков',
    model: 'gemini-2.0-flash-exp'
  },
  {
    name: 'Шутки про смешариков',
    desription: 'Артхаусные шутки про смешариков',
    model: 'gemini-2.0-flash-exp'
  }
] as IChat[]

const emptyChats = [] as IChat[]

export default async function MainPageDefault() {
  return (
    <section className="flex flex-col h-[100%] w-[80%] gap-5 shrink-0 grow-0 p-2">
      <YourChats chats={chats} />
    </section>
  );
}
