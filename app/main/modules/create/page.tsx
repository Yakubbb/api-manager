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
import FirstModuleConstructor from "@/components/firstModuleConstructor";
import SecondModuleComponent from "@/components/secondModuleComponent";
import ThirdModuleConstructor from "@/components/thirdModuleConstructor";


function SwitchButton({ name, page, setPage, forward }: {
  name: string
  page: number
  forward: number
  setPage: (value: number) => void
}) {
  return (
    <button className="flex flex-row justify-center rounded-xl bg-[#7242f5] w-24 h-8 text-white items-center text-center" onClick={() => setPage(page + forward)}>
      {name}
    </button>
  )
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(0)

  const [tags, setTags] = useState<ITag[]>([])

  const [photo, setPhoto] = useState<string>()
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [url, setUrl] = useState<string>()
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

  const pageMap = [
    {
      name: 'Внешний вид',
      description: 'настройка внешнего вида вашего модуля'
    },
    {
      name: 'Параметры',
      description: 'настройка json-схемы для ваших запросов'
    },
    {
      name: 'Валидация',
      description: 'соответствие требованиям'
    },
    {
      name: 'Публикация',
      description: 'соответствие требованиям'
    }
  ]


  const handlePageMapChange = (value: number) => {
    if (value >= pageMap.length) {
      setCurrentPage(0)
    }
    else if (value < 0) {
      setCurrentPage(pageMap.length - 1)
    }
    else {
      setCurrentPage(value)
    }
  }



  return (

    <section className=" flex flex-col items-center gap-1  h-full w-full p-3">
      <div className="flex flex-row justify-center items-center gap-1 w-full h-[10%] ">
        <div className="flex flex-row justify-center items-center gap-5 w-[70%] h-[100%] rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff]  pr-3 pl-3">
          <SwitchButton name="назад" page={currentPage} setPage={handlePageMapChange} forward={-1} />
          {pageMap.map((e, index) => {
            return (
              <div className="flex flex-col items-center justify-center w-[33%] h-full p-2 self-center hover:cursor-pointer" onClick={() => setCurrentPage(index)} key={index}>
                <div className={`text-center ${index == currentPage ? 'text-[#7242f5] font-bold text-xl' : ''}`}>
                  {e.name}
                </div>
                {index == currentPage && <div className="text-xs text-center text-[#5b5966]">
                  {e.description}
                </div>}
              </div>
            )
          })}
          <SwitchButton name="вперед" page={currentPage} setPage={handlePageMapChange} forward={1} />
        </div>

      </div>
      <div className="flex flex-col self-center items-center h-[90%] w-[90%]">
        {currentPage == 0 && <FirstModuleConstructor
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          photo={photo}
          setPhoto={updatePhoto}
          tags={selectedTags}
          setTags={handleSelection}
          deleteTags={handleDiselection}
          url={url}
          setUrl={setUrl}
          defaultTags={tags}
        />}
        {
          currentPage == 1 && <SecondModuleComponent
            inputs={inputs}
            outputs={outputs}
            setInputs={setInputs}
            setOutputs={setOutputs}
            avalibleTypes={['text', 'photo', 'fbx']}
          />
        }
        {
          currentPage == 2 && <ThirdModuleConstructor
            name={name || ''}
            description={description || ''}
            inputs={inputs}
            outputs={outputs}
            endpoint={url || ''}
            photo={photo || ''}
          />
        }
      </div>
    </section>
  );
}
