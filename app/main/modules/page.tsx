'use server'

import { IApi } from "@/custom-types";
import { ObjectId } from "mongodb";
import Image from "next/image";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { Suspense } from "react";
import { typesStyles } from "@/custom-constants";
import { ImFileEmpty } from "react-icons/im";

const modules = [
  {
    _id: new ObjectId(),
    isOficial: false,
    creatorId: new ObjectId(),
    name: 'aboba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/736x/57/4c/06/574c061aaae7f2f6177986cf8c71d439.jpg',
  },
  {
    _id: new ObjectId(),
    isOficial: true,
    creatorId: new ObjectId(),
    name: 'boba api',
    inputType: 'photo',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/ec/4e/db/ec4edbdfecb6c60f4d91a495b5fc2ce2.jpg',
    description: 'текст текст текст текст текст текст текст текст текст текст текст текст'
  },
  {
    _id: new ObjectId(),
    isOficial: false,
    creatorId: new ObjectId(),
    name: 'aboba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/31/3d/3c/313d3c942e1dad95f5149c7a5e27c9f6.jpg',
  },
  {
    _id: new ObjectId(),
    isOficial: true,
    creatorId: new ObjectId(),
    name: 'boba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/28/0b/14/280b14841159ed7540df35b72ff2174a.jpg',
    description: 'текст текст текст текст текст текст текст текст текст текст текст текст'
  },
  {
    _id: new ObjectId(),
    isOficial: false,
    creatorId: new ObjectId(),
    name: 'aboba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/a5/eb/39/a5eb394261c167f92cacad15a48b2666.jpg',
  },
  {
    _id: new ObjectId(),
    isOficial: false,
    creatorId: new ObjectId(),
    name: 'aboba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/b3/07/f4/b307f48f85a4a32502e2f509a3aa8c6d.jpg',
  },
  {
    _id: new ObjectId(),
    isOficial: false,
    creatorId: new ObjectId(),
    name: 'aboba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/04/de/fa/04defa539418b359d16f0f069e959200.jpg',
  },
] as IApi[]


const imageLoader = ({ src, width, quality }: any) => {
  return `https://i.pinimg.com/${src}?w=${width}&q=${quality || 75}`
}

export default async function () {
  return (
    <div className="flex flex-col w-[100%] h-[100%] items-center ">
      <div className="flex flex-col w-[100%] h-[100%] p-4 overflow-auto">
        <div className="sticky top-0 flex flex-row shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-3xl  w-[40%] p-1 bg-transparent text-xl items-center bg-white self-center">
          <IoIosSearch />
          <input className="focus:outline-none select-none flex bg-transparent items-center pl-3 p-1" placeholder="поиск" type="text" ></input>
        </div>
        <div className="flex flex-wrap gap-3 p-5 self-center">
          {modules.map((module, index) => {
            let Icon = ImFileEmpty
            if (typesStyles[module.inputType]) {
              Icon = typesStyles[module.inputType].Icon
            }
            return (
              <Link href={`/main/modules?id=${module._id.toString()}`} className="flex flex-col rounded-xl bg-[#E0E0E0] w-md max-w-xl h-sm group/item p-2 grow  shadow-[0_3px_10px_rgb(0,0,0,0.2)] " key={index}>
                <Suspense>
                  <Image className=" w-[100%] h-60 oobject-cover rounded-md " src={module.prewviewPhoto!} alt="нет фото : (" width={100} height={100} />
                  <div className="flex justify-between font-semibold text-xl items-center text-justify">
                    <div className="flex flex-row gap-1 items-center text-justify">
                      {module.name}
                      {module.isOficial && <IoShieldCheckmarkSharp className="text-[#26C281]" />}
                    </div>
                    <div className="flex flex-row gap-1 font-normal items-center text-justify ">
                      {
                        <Icon />
                      }
                      {
                        module.inputType
                      }
                    </div>
                  </div>
                  {module.description &&
                    <div className="flex text-justify p-2 w-sm grow">
                      {module.description}
                    </div>
                  }
                </Suspense>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
