import { IModel } from "@/custom-types";
import { useEffect, useState } from "react";
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


export function TypeSelectorForHandler({ avalibleTypes, setInput, input }: {
    avalibleTypes: string[],
    setInput: (value: { name: string, type: string }) => void
    input: { name: string, type: string }
}) {

    const [currentMarker, setCurrentMarker] = useState<number>(avalibleTypes.findIndex(v => v == input.type))


    const handleSelection = (inp: number) => {
        setCurrentMarker(currentMarker + inp)
    }

    useEffect(() => {
        if (currentMarker >= avalibleTypes.length) {
            setCurrentMarker(0)
        }
        else if (currentMarker < 0) {
            setCurrentMarker(avalibleTypes.length - 1)
        }
        else {
            setInput({ name: input.name, type: avalibleTypes[currentMarker] })
        }
    }, [currentMarker])


    return (
        <div className="flex flex-row justify-center items-center text-center gap-2 w-[40%] ">
            <button onClick={() => handleSelection(-1)} className="w-[30%] rounded-full bg-[#7242f5] text-white items-center text-center">
                {' < '}
            </button>
            <div className="w-[80%] self-center">
                {input.type}
            </div>
            <button onClick={() => handleSelection(1)} className="w-[30%] rounded-full bg-[#7242f5] text-white items-center text-center">
                {' > '}
            </button>
        </div>
    )
}