'use server'
import { IChat } from "@/custom-types";
import YourChats from "@/components/your-chats";
import { LuCookie } from "react-icons/lu";
import GeminiInfoMessage from "@/components/gemini-info-message";
import { AiOutlineCloudServer } from "react-icons/ai";
import { BsKey } from "react-icons/bs";
import { BiGhost } from "react-icons/bi";
import { RiChatNewLine } from "react-icons/ri";
import getAvalibleModels, { createChat, getChatLinks } from "@/server-side/chat-handler";


export default async function MainPageDefault() {
  const models = await getAvalibleModels()
  return (
    <section className="flex flex-row h-[100%] w-[100%] gap-8 p-4">
      <div className="flex flex-col h-[100%] w-[70%] gap-10 justify-between">
        <div className="flex flex-col w-[100%] h-[20%] text-xl  text-center gap-1 rounded-3xl p-4 text-md ">
          <div className="text-3xl font-bold ">
            Gemini AI
          </div>
          <p>Здесь вы сможете протестировать различные промпты для работы с Gemini.</p>
          <p>Так как все запросы идут через сервер организации, работа возможна без VPN из любой части мира</p>
        </div>
        <div className="flex flex-row gap-2 self-center w-[50%] h-10 items-center">
          <button className="flex flex-col rounded-3xl bg-[#7242f5] text-[#e9ecef] text-center items-center w-[100%] h-[100%]" onClick={createChat}>
            <div className="flex flex-row text-xl gap-2 p-1 text-center items-center justify-center ">
              <RiChatNewLine />
              Новый чат
            </div>
          </button>
        </div>
        <div className="flex flex-row w-[100%] gap-2  text-md p-2 text-[#5b5966]">
          <BiGhost size={40} />
          Если вы не хотите хранить ключ у нас, вы всегда можете вводить ключ непосредственно на странице с чатом,
          при обновлении страницы придется вводить его заново
        </div>
        <div className="flex flex-row h-[40%] w-[100%] gap-6">

          <GeminiInfoMessage
            name="Сессионные ключи"
            description="Вы можете использовать ваш сессионный ключ при работе с Gemini"
            href="/main/keys"
            Icon={LuCookie}
          />

          <GeminiInfoMessage
            name="Наш ключ"
            description="Если вы доверенный пользователь, вы можете использовать ключ, предоставляемый нами"
            href="/main/keys"
            Icon={BsKey}
          />
        </div>
      </div>
      <YourChats />
    </section>
  );
}
