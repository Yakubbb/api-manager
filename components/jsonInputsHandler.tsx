import { IoMdAddCircle } from "react-icons/io"
import { MdDeleteOutline } from "react-icons/md"
import TypeSelector, { TypeSelectorForHandler } from "./typeSelector"


export default function ({ name, inputs, handleAddingNewInput, handleInputNameChange, handleInputDeleting, valueName, avalibleTypes }: {
    name: string,
    valueName: string,
    inputs: any[],
    handleAddingNewInput: (value: any) => void,
    handleInputNameChange: (name: string, number: number, newType?: string) => void
    handleInputDeleting: (index: number) => void
    avalibleTypes: any[]
}) {
    return (
        <div className="flex flex-col gap-2 rounded-xl w-[50%] h-[100%] p-4 ">
            <div className="flex flex-row gap-1 text-xl font-semibold">
                {name}
                <div className="text-[#7242f5] hover:cursor-pointer">
                    <IoMdAddCircle className="self-center" size={30} onClick={
                        () => handleAddingNewInput({ name: `${valueName} ${inputs.length}`, type: 'text' })
                    } />
                </div>
            </div>
            <div className="flex flex-col gap-2 w-[100%] rounded-xl grow p-4 overflow-auto border-2 border-[#9ca3af] rounded-xl">
                {inputs.map((e, idex) => {
                    console.log(inputs)
                    return (
                        <div className="flex flex-row justify-between gap-1 shadow-[0_3px_10px_rgb(0,0,0,0.1)] rounded-xl w-[100%]" key={idex}>
                            <MdDeleteOutline className="hover:text-[#ff3333] text-[#363636] hover:cursor-pointer" size={30} onClick={() => handleInputDeleting(idex)} />
                            <input className="rounded-md focus:outline-none select-none bg-transparent" type="text" value={e.name} onChange={(event) => handleInputNameChange(event.target.value, idex)} />
                            <TypeSelectorForHandler avalibleTypes={avalibleTypes} input={e} setInput={(value) => handleInputNameChange(value.name, idex, value.type)} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
