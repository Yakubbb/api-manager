'use client'
import TagSelector from "@/components/tag-selector";
import { ITag } from "@/custom-types";
import { getAllTags } from "@/server-side/database-handler";
import { useEffect, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { ImImages } from "react-icons/im";
import { IoMdAddCircle, IoMdCloseCircle } from "react-icons/io";


export default function Home() {

  const [photo, setPhoto] = useState<string>()
  const [tags, setTags] = useState<ITag[]>([])
  const [selectedTags, setSelectedTags] = useState<ITag[]>([])

  const [inputs, setInputs] = useState<{ name: string, type: string }[]>([])
  const [outputs, setOutputs] = useState<{ name: string, type: string }[]>([])

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
      console.log(event.target.files[0])
      if (event.target.files[0].type != 'image/png') {
        return
      }
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
      <form action="" className="flex flex-row gap-2 h-[100%] w-[100%] p-2">
        <div className="flex flex-col p-3 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#e0e0e0] gap-4 h-[100%] w-[50%]">
          <div className="rounded-md p-2 h-[50%] w-[100%]">
            <div className="flex flex-row h-[90%] w-[100%] bg-[#7242f5] items-center text-center rounded-xl p-2">
              {photo && <img className="h-[100%] w-[100%] object-scale-down self-center rounded-xl" src={photo} alt="загрузите фото" />
                ||
                <div className="flex flex-row justify-center gap-2 items-center text-center">
                  <IoImageOutline className="flex self-center" size={200} />
                  <div className="text-3xl self-center font-semibold">
                    загрузите изображение
                  </div>
                </div>
              }
            </div>
            <input required type="file" className="font-semibold bg-transparent focus:outline-none mt-3" onInput={updatePhoto} placeholder="название" name="name" />
          </div>
          <div className="">
            <div className="font-semibold">
              Теги:
            </div>
            <TagSelector options={tags} values={selectedTags} updateValues={handleSelection} deleteValue={handleDiselection} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold">
              Название:
            </div>
            <input name="name" className="  text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center p-2 border-2 border-[#9ca3af] rounded-md  " placeholder="введите название" type="text" autoComplete="off" />
          </div>
          <div className="flex flex-col gap-1 h-xl grow">
            <div className="font-semibold">
              Описание:
            </div>
            <textarea name="description" className=" w-[100%] h-[100%] text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center  border-2 border-[#9ca3af] rounded-md p-2" placeholder="введите описание" autoComplete="off" />
          </div>
        </div>
        <div className="flex flex-col gap-2 h-[100%] w-[50%] rounded-md p-2 ">
          <div className="bg-[#cccccc] rounded-xl w-[100%] h-xl p-4">
            <div className="flex flex-row font-semibold gap-1 items-center text-center">
              Входные данные
            </div>
            <div className="flex flex-col gap-2 p-2 pb-0">
              {inputs.map(e => {
                return (
                  <div className="flex flex-row gap-1">
                    <div>{e.name}</div>
                    <div>{e.type}</div>
                  </div>
                )
              })}
              <IoMdAddCircle className="self-center" size={30} />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
