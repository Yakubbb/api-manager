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
    <section className="flex flex-row h-[100%] w-[85%] gap-8 p-2">
      <div className="flex flex-col h-full w-[70%] gap-5">

        <div className="flex flex-col w-[100%] h-[20%] gap-1 rounded-3xl p-4 bg-[#7242f5] font-semibold">
          <div className="text-xl">
            Gemini AI
          </div>
          <p>здесь вы сможете протестировать различные промпты для работы с Gemini.</p>
          <p>Так как все запросы идут через сервер организации, работа возможна без VPN из любой части мира</p>
        </div>
        <div className="flex flex-row gap-2">
          <button className="flex flex-row rounded-2xl bg-[#00ff80] text-xl gap-2 h-[5%] w-[20%] text-center items-center p-3" onClick={createChat}>          <RiChatNewLine />
            Новый чат
          </button>
        </div>
        <div className="flex flex-row w-[100%] gap-2 items-center text-md p-2">
          <BiGhost size={40} />
          Если вы не хотите хранить ключ у нас, вы всегда можете вводить ключ непосредственно на странице с чатом,
          при обновлении страницы придется вводить его заново
        </div>
        <div className="flex flex-row h-[40%] w-[100%] gap-6 mt-10">

          <GeminiInfoMessage
            name="Сессионные ключи"
            description="Вы можете использовать ваш сессионный ключ при работе с Gemini"
            href="/main/keys"
            Icon={LuCookie}
          />

          <GeminiInfoMessage
            name="Облачное хранение"
            description="Если вы храните ваш ключ на нашем сервере, вы можете использовать его"
            href="/main/keys"
            Icon={AiOutlineCloudServer}
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
