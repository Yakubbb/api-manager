import Image from "next/image";
import { ChatBlock } from "@/components/chat-block";
import { IMessage } from "@/custom-types";
import { ModelOptionsBar } from "@/components/model-options-bar";


//        <ModelOptionsBar/>
export default function MainPageDefault() {
  return (
    <section className="flex flex-row h-[100%] w-[80%] gap-5 shrink-0 grow-0">
      мейн страница
    </section>
  );
}
