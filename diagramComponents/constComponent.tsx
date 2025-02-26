import { useState } from "react";
import { CustomOutputHandle } from "./moduleComponent";
import { BsFileEarmarkLock } from "react-icons/bs";
import { RiAddCircleLine } from "react-icons/ri";
import { Handle, Position } from "@xyflow/react";
import { MdDeleteOutline } from "react-icons/md";
import { typesStyles } from "@/custom-constants";
import TypeSelector from "@/components/typeSelector";




export function ConstantOutputHandle({ out, constants, setConstant }:
    {
        out: { type: any, value: any, name: string, id: number }
        constants: { type: any, value: any, name: string, id: number }[],
        setConstant: (constants: { type: any, value: any, name: string, id: number }[]) => void,
    }) {

    const Icon = typesStyles[out.type].Icon

    const changeConstants = (constant: { type: any, value: any, name: string, id: number }) => {
        setConstant(constants.map((c) => {
            if (c.id == constant.id) {
                return constant
            }
            else {
                return c
            }
        }))
    }

    const removeConstant = (constant: { type: any, value: any, name: string, id: number }) => {
        setConstant(constants.filter(e => e.id != constant.id))
    }

    return (
        <div className={`flex flex-row w-[100%] gap-1 bg-[#E0E0E0] rounded-md p-1 `}>
            <div className="hover:text-[#ff3333] hover:cursor-pointer items-center" onClick={async () => await removeConstant(out)}>
                <MdDeleteOutline size={25} />
            </div>
            
            <div style={{ color: '#666666' }}>
                <input className="w-min p-1 rounded-md" type="text" placeholder="введите название" defaultValue={out.name} onChange={(event) => changeConstants({
                    name: event.target.value,
                    type: out.type,
                    value: out.value,
                    id: out.id
                })} />
            </div>

            <input className="flex p-1 rounded-md" type="text" placeholder={`введите значение`} onChange={(event) => changeConstants({
                name: out.name,
                type: out.type,
                value: event.target.value,
                id: out.id
            })} />
            <div className='flex justify-start mr-2'>
                <div className='flex flex-row gap-1 items-center' style={
                    {
                        color: `${typesStyles[out.type].style}`
                    }
                }>
                    <div className={`font-semibold`}>{out.type}</div>
                    <Icon />
                </div>
                <Handle
                    type="source"
                    position={Position.Right}
                    id={out.name}
                    style={
                        {
                            backgroundColor: `${typesStyles[out.type].style}`,
                            width: '20px',
                            height: '20px',
                            borderRadius: '15px',
                            border: '4px solid #edeff5',
                            display: 'flex',
                            position: 'relative'
                        }
                    }
                />
            </div>
        </div>
    );
}



export const ConstantNode = ({ }: {}) => {

    const [values, setValues] = useState<{ type: 'text' | 'Photo' | 'Fbx', value: any, name: string, id: number }[]>([])

    return (
        <div className="rounded-xl bg-white border-2" style={
            {
                paddingBottom: '10px'
            }}>
            <div className="flex gap-1 text-lg font-semibold items-center text-center ">
                <BsFileEarmarkLock size={20} />
                Константы
            </div>
            <div className='flex flex-col gap-1 mt-2 '>
                <div className='flex flex-col gap-1'>
                    {values.map((inp, index) => {
                        return (
                            <ConstantOutputHandle out={inp} key={index} constants={values} setConstant={setValues} />
                        )
                    })}
                    <div className="mt-2 flex justify-center gap-5 bg-indigo-400 rounded-md p-1 items-center hover:cursor-pointer " onClick={() => setValues([
                        ...values,
                        {
                            type: 'text',
                            name: `константа ${values.length}`,
                            value: '',
                            id: values.length
                        }
                    ]
                    )}>
                        <RiAddCircleLine className="" size={20} />
                    </div>
                </div>
            </div>


        </div>
    );
};