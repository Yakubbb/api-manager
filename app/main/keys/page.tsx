import Image from "next/image";
import { ChatBlock } from "@/components/chat-block";
import { IMessage } from "@/custom-types";
import { ModelOptionsBar } from "@/components/model-options-bar";
import { LuCookie } from "react-icons/lu";


const keys = [
  {
    name: 'aboba',
    key: '123213'
  },
  {
    name: 'hoba',
    key: '1232421421413'
  },
  {
    name: 'bobboba',
    key: '55555'
  },
  {
    name: 'adsdsad',
    key: '123213'
  }
]
export default function Home() {
  return (
    <section className="flex flex-row h-[100%] w-[80%] gap-5 p-4 overflow-y-scroll">
      <div>
        <div className="flex flex-row gap-2 text-3xl font-bold items-center">
          <LuCookie />
          Сессионные ключи
        </div>
        <div className="flex flex-wrap gap-2 p-2">
          {keys.map((key, index) => {
            return (
              <div key={index} className="p-3 h-xl w-xl rounded-2xl bg-[#E0E0E0]">
                <div className="flex flex-row gap-1">
                  <div className="font-semibold">
                    Название сервиса:
                  </div>
                  {key.name}
                </div>
                <div className="flex flex-row gap-1">
                  <div className="font-semibold">
                    Ключ:
                  </div>
                  {key.key}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>

  );
}
