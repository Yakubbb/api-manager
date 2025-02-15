import { ITag } from "@/custom-types";

export default function ({ value, onClick }: { value: ITag, onClick: (tag: ITag) => void }) {

    const colors: { [key: string]: string } = {
        "rose": 'border-2 border-rose-500 text-rose-500',
        "bluegem": 'border-2 border-indigo-600 text-indigo-600',
        "light": 'border-2 text-white border-black bg-[#13b03d]',
        "fuchsia": 'border-2 border-fuchsia-400 text-fuchsia-400',
        "rare": 'border-2 border-black bg-gradient-to-r from-blue-500 to-purple-500 text-white',
        "orange": 'border-2 border-black bg-[#eb9234] text-black ',
        "happy": 'border-2 border-black bg-gradient-to-r from-fuchsia-600 to-yellow-500 text-white',
        "aaa": 'border-2 border-black bg-gradient-to-r from-violet-300 to-fuchsia-100  text-indigo-600',
    }

    return (
        <div onClick={() => onClick(value)} className={`text-center font-normal  min-w-xs h-[5%] items-center  ${colors[value.color]} hover:cursor-pointer`}>
            {value.name}
        </div>
    )
}