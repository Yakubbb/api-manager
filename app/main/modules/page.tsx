'use server'

import { IApi } from "@/custom-types";
import { ObjectId } from "mongodb";
import Image from "next/image";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { TbHexagon3D } from "react-icons/tb";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdOutlineArrowOutward } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const modules = [
  {
    _id: new ObjectId(),
    isOficial: false,
    creatorId: new ObjectId(),
    name: 'aboba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/736x/21/99/6c/21996cafd2ab9d2a40166bfef7d78e29.jpg',
  },
  {
    _id: new ObjectId(),
    isOficial: true,
    creatorId: new ObjectId(),
    name: 'boba api',
    inputType: 'Photo',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/04/68/ea/0468ea5cac497cc71469bb5608279b61.jpg',
  },
  {
    _id: new ObjectId(),
    isOficial: true,
    creatorId: new ObjectId(),
    name: 'hoba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/736x/21/99/6c/21996cafd2ab9d2a40166bfef7d78e29.jpg',
    description: 'текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст  текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст'
  },
  {
    _id: new ObjectId(),
    isOficial: false,
    creatorId: new ObjectId(),
    name: 'boba api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/20/4d/64/204d648dda6fbed6233046e23d7cd542.jpg',
    description: 'текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст  текст текст текст текст текст'
  },
  {
    _id: new ObjectId(),
    isOficial: true,
    creatorId: new ObjectId(),
    name: 'hoba api',
    inputType: 'Photo',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/736x/21/99/6c/21996cafd2ab9d2a40166bfef7d78e29.jpg',
    description: 'текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст  текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст'
  }, {
    _id: new ObjectId(),
    isOficial: true,
    creatorId: new ObjectId(),
    name: 'boba api',
    inputType: 'Fbx',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/04/68/ea/0468ea5cac497cc71469bb5608279b61.jpg',
    description: 'текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст  текст текст текст текст текст'
  },
  {
    _id: new ObjectId(),
    isOficial: true,
    creatorId: new ObjectId(),
    name: 'hobaaaaaaaaaaaaaaa api',
    inputType: 'text',
    endpoint: 'http://localhost:3000/main/modules',
    prewviewPhoto: 'https://i.pinimg.com/474x/96/a5/cf/96a5cfbf4fc22739dbf107766785a341.jpg',
    description: 'текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст  текст текст текст текст текст текст текст текст текст текст текст текст текст  текст текст текст текст текст текст текст текст текст текст текст текст текст  текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст  текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст'
  },
] as IApi[]


const imageLoader = ({ src, width, quality }: any) => {
  return `https://i.pinimg.com/${src}?w=${width}&q=${quality || 75}`
}

export default async function () {
  return (
    <div className="flex flex-col w-[100%] h-[100%] items-center p-4">
      <div className="flex flex-row shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-3xl  w-[40%] p-1 mb-1 bg-transparent text-xl items-center">
        <IoIosSearch />
        <input className="focus:outline-none select-none flex bg-transparent items-center pl-3 p-1" placeholder="поиск" type="text" ></input>
      </div>
      <div className="flex flex-col w-[100%] h-[100%] overflow-auto">
        <div className="flex flex-wrap gap-3 p-5 self-center">
          {modules.map((module, index) => {
            return (
              <Link href={`/main/modules?id=${module._id.toString()}`} className="flex flex-col rounded-xl bg-[#E0E0E0] w-md max-w-xl h-sm group/item p-2 grow  shadow-[0_3px_10px_rgb(0,0,0,0.2)] " key={index}>
                <Image className=" w-[100%] h-60 oobject-cover rounded-md " src={module.prewviewPhoto!} alt="нет фото : (" width={100} height={100} />
                <div className="flex justify-between font-semibold text-xl items-center text-justify">
                  <div className="flex flex-row gap-1 items-center text-justify">
                    {module.name}
                    {module.isOficial && <IoShieldCheckmarkSharp className="text-[#26C281]" />}
                  </div>
                  <div className="flex flex-row gap-1 font-normal items-center text-justify ">
                    {
                      module.inputType == 'Fbx' && <TbHexagon3D /> ||
                      module.inputType == 'Photo' && <MdPhotoSizeSelectActual /> ||
                      module.inputType == 'text' && <TiDocumentText />
                    }
                    {
                      module.inputType
                    }
                  </div>
                </div>
                <div className="flex text-justify p-2 w-sm grow">
                  {module.description || 'без описания'}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
