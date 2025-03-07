import { ITag } from "@/custom-types";
import { MdOutlineDeleteForever } from "react-icons/md";

export default function ({ value, onClick, deleting }: { value: ITag, onClick: (tag: ITag) => void, deleting?: Boolean }) {

    const colors: { [key: string]: string } = {
        "rose": 'border-2 border-rose-500 text-rose-500',
        "bluegem": 'border-2 border-indigo-600 text-indigo-600',
        "light": 'border-2 text-white border-black bg-[#13b03d]',
        "fuchsia": 'border-2 border-fuchsia-400 text-fuchsia-400',
        "rare": 'border-2 border-black bg-gradient-to-r from-blue-500 to-purple-500 text-white',
        "orange": 'border-2 border-black bg-[#eb9234] text-black ',
        "happy": 'border-2 border-black bg-gradient-to-r from-fuchsia-600 to-yellow-500 text-white',
        "aaa": 'border-2 border-black bg-gradient-to-r from-violet-300 to-fuchsia-100  text-indigo-600',
        "calm": 'border-2 border-black bg-gradient-to-r from-violet-300 to-fuchsia-100  text-indigo-600',
        "not-calm": 'border-2 border-black bg-gradient-to-r from-violet-300 to-fuchsia-100  text-indigo-600',
    }

    return (
        <div onClick={() => onClick(value)} className={`group/item text-center font-semibold  min-w-xs h-xs items-center justify-center  ${colors[value.color]} hover:cursor-pointer rounded-md p-1`}>
            {deleting &&
                <div>
                    <div className="group-hover/item:hidden block  justify-center ">
                        {value.name}
                    </div>
                    <div className="flex flex-row group-hover/item:block hidden w-10 items-center text-center  justify-center">
                        <MdOutlineDeleteForever className="self-center ml-[25%]" size={25} />
                    </div>
                </div> || value.name}
        </div>
    )
}