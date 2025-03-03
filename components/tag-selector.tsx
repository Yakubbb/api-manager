import { ITag } from "@/custom-types";
import { useState } from "react";
import { FaCircleChevronUp } from "react-icons/fa6";
import Tag from "./tag";
import { IoMdAddCircle } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

export default function ({ options, values, updateValues, deleteValue }: { options?: ITag[], values?: ITag[], updateValues: (value: ITag) => void, deleteValue: (value: ITag) => void }) {


    const [showOptionsState, setShowOptionsState] = useState<boolean>(false)


    const handleSelection = (value: ITag) => {
        updateValues(value)
        console.log(options?.length)
        if (options?.length == 1) {
            setShowOptionsState(false)
        }

    }
    const handleD = (value: ITag) => {
        deleteValue(value)
        setShowOptionsState(false)
    }
    return (
        <div className="relative  flex flex-col gap-2">
            <div className="flex flex-row rounded-xl p-1 h-xs ">
                <div className="flex flex-wrap gap-3 w-[100%] h-[100%]">
                    {values?.map((v) => {

                        return (
                            <Tag key={v._id} value={v} onClick={handleD} deleting={true} />
                        )
                    })}
                    {options?.length != 0 &&
                        <div onClick={() => setShowOptionsState(!showOptionsState)} className="text-[#7242f5] hover:cursor-pointer">
                            {showOptionsState && <IoMdCloseCircle size={30} />}
                            {!showOptionsState && <IoMdAddCircle size={30} />}
                        </div>
                    }
                </div>
            </div>
            <div>
                {showOptionsState &&
                    <div className="flex flex-wrap shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl overflow-auto gap-1 p-2 absolute backdrop-blur-xl ">
                        {options?.map((option, index) => {
                            return (
                                <Tag key={option._id} value={option} onClick={handleSelection} />
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    )
}