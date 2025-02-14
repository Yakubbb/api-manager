import { ITag } from "@/custom-types";

export default function ({ value, onClick }: { value: ITag, onClick: (tag: ITag) => void }) {

    const colors: { [key: string]: string } = {
        "rose": 'border-rose-500 text-rose-500',
        "bluegem": 'border-indigo-600 text-indigo-600',
        "light": 'border-green-400 text-green-400',
        "fuchsia": 'border-fuchsia-400 text-fuchsia-400',
    }

    return (
        <div onClick={() => onClick(value)} className={`text-center font-normal  min-w-[7%] min-h-[20%] border-2 ${colors[value.color]} hover:cursor-pointer`}>
            {value.name}
        </div>
    )
}