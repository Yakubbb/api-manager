import { ITag } from "@/custom-types";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Tag from "./tag";

export default function ({ options, values, updateValues, deleteValue }: { options?: ITag[], values?: ITag[], updateValues: (value: ITag) => void, deleteValue: (value: ITag) => void }) {


    const [showOptionsState, setShowOptionsState] = useState<boolean>(false)


    const handleSelection = (value: ITag) => {
        updateValues(value)
        setShowOptionsState(false)
    }
    const handleD = (value: ITag) => {
        deleteValue(value)
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between border-2 border-black rounded-2xl p-2 items-center hover:cursor-pointer" onClick={() => setShowOptionsState(!showOptionsState)}>
                <div className="flex flex-wrap gap-3 w-[100%]">
                    {values?.map((v) => {

                        return (
                            <Tag key={v._id} value={v} onClick={handleD} />
                        )
                    })}
                </div>
                {showOptionsState && <IoIosArrowUp />}
                {!showOptionsState && <IoIosArrowDown />}
            </div>
            <div className="flex flex-col shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl ">
                {showOptionsState && options?.map((option, index) => {
                    return (
                        <div key={index} className="flex justify-between p-4 text-slate-600 hover:cursor-pointer" onClick={() => handleSelection(option)}>
                            {option.name}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}