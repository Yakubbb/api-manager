import { IModel } from "@/custom-types";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { typesStyles } from "@/custom-constants";


export default function ({ options, setValue, value }: { options: string[], setValue: (model: any) => void, value?: any }) {



    const [showOptionsState, setShowOptionsState] = useState<boolean>(false)


    const handleSelection = (value: any) => {
        setValue(value)
        setShowOptionsState(false)
    }

    return (
        <div className=" relative">
            <div className="flex justify-between  rounded-2xl p-2 items-center hover:cursor-pointer" onClick={() => setShowOptionsState(!showOptionsState)}>
                {value}
                {showOptionsState && <IoIosArrowUp />}
                {!showOptionsState && <IoIosArrowDown />}
            </div>
            <div>
                {showOptionsState &&
                    <div className="flex flex-wrap shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-2xl overflow-auto gap-1 p-4 absolute backdrop-blur-xl ">
                        {options.map((option, index) => {
                            return (
                                <div key={index} className="flex flex-row gap-1 hover:cursor-pointer hover:bg-[#cccccc] w-[100%] rounded-xl p-3" onClick={() => handleSelection(option)}>
                                    {option}
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    )
}