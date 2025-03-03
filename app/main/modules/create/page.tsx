'use client'
import TagSelector from "@/components/tag-selector";
import { ITag } from "@/custom-types";
import { getAllTags } from "@/server-side/database-handler";
import { useEffect, useState } from "react";
import { IoImageOutline } from "react-icons/io5";
import { ImImages } from "react-icons/im";
import { IoMdAddCircle, IoMdCloseCircle } from "react-icons/io";
import JsonInputsRenderer from "@/components/jsonInputsRenderer";
import JsonInputsHandler from "@/components/jsonInputsHandler";


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

  const handleAddingNewInput = (value: { name: string, type: string }) => {
    setInputs([...inputs, value])
  }

  const handleAddingNewOutput = (value: { name: string, type: string }) => {
    setOutputs([...outputs, value])
  }

  const handleInputNameChange = (newName: string, newindex: number) => {
    setInputs(inputs.map((inp, index) => {
      if (index == newindex) {
        return { name: newName, type: inp.type }
      }
      else {
        return { name: inp.name, type: inp.type }
      }
    }))
  }

  const handleOutputNameChange = (newName: string, newindex: number) => {
    setOutputs(outputs.map((inp, index) => {
      if (index == newindex) {
        return { name: newName, type: inp.type }
      }
      else {
        return { name: inp.name, type: inp.type }
      }
    }))
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


  const configureAddRequest = (form: FormData) => {
    let name = form.get('name')
    let description = form.get('description')
    let image = form.get('image')
    let endpoint = form.get('url')
    let tags = selectedTags
    let freezeInputs = inputs
    let freezeOutputs = outputs


    const readyToAddModule = {
      name: name,
      description: description,
      image: image,
      inputs: freezeInputs,
      outputs: freezeOutputs,
      tags: tags,
      endpoint: endpoint
    }

    console.log(readyToAddModule)
  }



  return (

    <section className=" flex flex-col h-[100%] w-[100%] gap-3 p-3 overflow-hidden ">
      <form action={configureAddRequest} className="flex flex-row gap-2 h-[100%] w-[100%]" >
        <div className="flex flex-col rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff] h-[100%] w-[50%] p-3 ">
          <div className="rounded-md p-2 h-[50%] w-[100%]">
            <div className="flex flex-row h-[90%] w-[100%] bg-[#cccccc] items-center text-center rounded-xl">
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
            <input required type="file" className="font-semibold bg-transparent focus:outline-none mt-3" onInput={updatePhoto} placeholder="название" name="image" />
          </div>
          <div className="">
            <div className="font-semibold">
              Теги:
            </div>
            <TagSelector options={tags} values={selectedTags} updateValues={handleSelection} deleteValue={handleDiselection} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold">
              URL:
            </div>
            <input required name="url" className="  text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center p-2 border-2 border-[#9ca3af] rounded-md  " placeholder="введите название" type="url" autoComplete="off" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold">
              Название:
            </div>
            <input required name="name" className="  text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center p-2 border-2 border-[#9ca3af] rounded-md  " placeholder="введите название" type="text" autoComplete="off" />
          </div>
          <div className="flex flex-col gap-1 h-xl grow">
            <div className="font-semibold">
              Описание:
            </div>
            <textarea name="description" className=" w-[100%] h-[100%] text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center  border-2 border-[#9ca3af] rounded-md p-2" placeholder="введите описание" autoComplete="off" />
          </div>
        </div>
        <div className="w-[100%] h-[100%] p-2">
          <div className="flex flex-col w-[100%] h-[100%] gap-2 ">
            <div className="flex flex-row gap-2 w-[100%] h-[50%] rounded-xl bg-[#ffffff] shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-2">
              <JsonInputsRenderer name="тело запроса" inputs={inputs} />
              <JsonInputsRenderer name="тело ответа" inputs={outputs} />
            </div>
            <div className="flex flex-row gap-2 h-[50%] rounded-xl bg-[#ffffff] shadow-[0_3px_10px_rgb(0,0,0,0.2)] p-2">
              <JsonInputsHandler valueName="вход" name="входные данные" inputs={inputs} handleInputNameChange={handleInputNameChange} handleAddingNewInput={handleAddingNewInput} />
              <JsonInputsHandler valueName="выход" name="выходные данные" inputs={outputs} handleInputNameChange={handleOutputNameChange} handleAddingNewInput={handleAddingNewOutput} />
            </div>
          </div>
        </div>
        <div>
          <input type="submit" value={'сохранить'} />
        </div>
      </form>
    </section>
  );
}
