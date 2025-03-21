import { IoImageOutline } from "react-icons/io5"
import TagSelector from "./tag-selector"

export default function ({ photo, setPhoto, name, setName, tags, setTags, url, setUrl, description, setDescription, deleteTags, defaultTags }: {
    photo: any
    name: any
    url: any
    description: any
    tags: any[]
    setPhoto: (value: any) => void
    setTags: (value: any) => void
    setUrl: (value: any) => void
    setName: (value: any) => void
    setDescription: (value: any) => void
    deleteTags: (value: any) => void
    defaultTags: any
}) {
    return (
        <div className="flex flex-row justify-center h-[100%]  w-[100%] p-4 gap-4 ">
            <div className="flex flex-col gap-4 w-[100%] h-[100%]">
                <div className="rounded-md p-2 h-[60%] w-[100%] rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.1)] bg-[#ffffff] p-5">
                    <div className="flex flex-row h-[90%] w-[100%] bg-[#cccccc] items-center text-center rounded-xl justify-center">
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

                    <input required type="file"
                        className="mt-2 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                        onInput={setPhoto} placeholder="название" name="image" />
                </div>
                <div className="flex flex-col gap-1 rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff] h-[20%] p-2">
                    <div className="font-semibold">
                        Теги:
                    </div>
                    <TagSelector options={defaultTags} values={tags} updateValues={setTags} deleteValue={deleteTags} />
                </div>
                <div className="flex flex-col rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff] gap-1 p-2">
                    <div className="font-semibold">
                        URL:
                    </div>
                    <input value={url || ''} onChange={(event) => setUrl(event.target.value)} required name="url" className="  text-xl focus:outline-none select-none flex bg-transparent w-full items-center p-2 border-2 border-[#9ca3af] rounded-2xl  " placeholder="введите название" type="url" autoComplete="off" />
                </div>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ffffff]  p-2">
                <div className="flex flex-col gap-1">
                    <div className="font-semibold">
                        Название:
                    </div>
                    <input value={name || ''} onChange={(event) => setName(event.target.value)} required name="name" className="w-full  text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center p-2 border-2 border-[#9ca3af] rounded-2xl  " placeholder="введите название" type="text" autoComplete="off" />
                </div>
                <div className="flex flex-col gap-1 h-xl grow">
                    <div className="font-semibold">
                        Описание:
                    </div>
                    <textarea value={description || ''} onChange={(event) => setDescription(event.target.value)} name="description" className=" w-[100%] h-[100%] text-xl focus:outline-none select-none flex bg-transparent w-11/12 items-center  border-2 border-[#9ca3af] rounded-2xl p-2" placeholder="введите описание" autoComplete="off" />
                </div>
            </div>
        </div>
    )
}