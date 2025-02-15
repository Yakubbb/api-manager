'use client'
import TagSelector from "@/components/tag-selector";
import Selector from "@/components/tag-selector";
import { ITag } from "@/custom-types";
import { getAllTags } from "@/server-side/database-handler";
import { useEffect, useState } from "react";


export default function Home() {

  const [photo, setPhoto] = useState<string>()
  const [tags, setTags] = useState<ITag[]>([])
  const [selectedTags, setSelectedTags] = useState<ITag[]>([])

  const handleSelection = (value: ITag) => {
    setSelectedTags([
      ...selectedTags,
      value
    ])

    setTags(
      tags.filter((t) => t._id != value._id)
    )
  }

  const handleDiselection = (value: ITag) => {
    setSelectedTags(selectedTags.filter((t) => t._id != value._id))

    setTags(
      [
        ...tags,
        value
      ]
    )
  }

  const updatePhoto = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(URL.createObjectURL(event.target.files[0]));
    }
  }

  const getTags = async () => {
    setTags(await getAllTags())
  }

  useEffect(() => {
    getTags()
  }, []);



  return (

    <section className=" flex flex-col h-[100%] w-[100%] gap-3 p-2 overflow-auto ">
      <form action="" className="flex flex-col w-[100%] gap-4 bg-[#E0E0E0] shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl p-4 self-center">
        <div className="text-xl font-semibold">
          Добавление нового модуля
        </div>
        <div className="flex flex-col size-xs rounded-md p-1 items-center bg-[#E0E0E0] shadow-[0_3px_10px_rgb(0,0,0,0.2)] self-center">
          <img src={photo} alt="фото не загружено" className="rounded-md self-center text-center  w-[100%] h-[100%]" />
        </div>
        <input required type="file" className="font-semibold bg-transparent focus:outline-none mt-5" onInput={updatePhoto} placeholder="название" name="name" />
        <div>
        </div>
        <div className="flex flex-col p-2 gap-2">
          Название модуля
          <input required className="font-semibold border-2 border-black rounded-xl p-1 bg-transparent focus:outline-none" placeholder="название" name="name" />
        </div>
        <div className="flex flex-col p-2 gap-2">
          Описание модуля
          <textarea required name="description" className="text-slate-600 border-2 border-black rounded-xl p-1 bg-transparent focus:outline-none w-90 h-48" placeholder="описание"></textarea>
        </div>
        <div className="flex flex-col p-2 gap-2">
          Теги
          <TagSelector options={tags} values={selectedTags} updateValues={handleSelection} deleteValue={handleDiselection} />
        </div>
        <div className="flex flex-col p-2 gap-2">
          URL
          <input required type="url " className="font-semibold border-2 border-black rounded-xl p-1 bg-transparent focus:outline-none" placeholder="адресс" name="url" />
        </div>
      </form>
      <div className=" bg-[#E0E0E0] shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl p-4">
        <div className="text-xl font-semibold">
          Конструктор входных значений
        </div>
      </div>
    </section>
  );
}
