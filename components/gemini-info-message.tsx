import Link from "next/link";
import { IconType } from "react-icons";
import { MdOutlineArrowOutward } from "react-icons/md";


export default function ({
    name,
    description,
    href,
    Icon
}: {
    name: string,
    description: string,
    href: string,
    Icon: IconType
}) {
    return (

        <div className="flex flex-col rounded-2xl p-3 bg-[#ffffff] h-[100%] w-[40%] justify-between shadow-[0_3px_10px_rgb(0,0,0,0.1)] ">
            <div className="flex flex-row gap-2 text-xl font-semibold items-center text-center">
                <Icon />
                {name}
            </div>
            <p>{description}</p>

            <Link className="flex flex-row gap-1 items-center mt-10 text-center text-md text-[#7242f5]" href={href}>
                Перейти
                <MdOutlineArrowOutward />
            </Link>
        </div>
    )
}