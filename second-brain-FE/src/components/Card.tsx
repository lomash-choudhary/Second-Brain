import { DeleteIcon } from "../icons/DeleteIcon"
import { BiSolidEdit } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { ImLink } from "react-icons/im";

export interface cardInputInterface{
    title:string,
    link:string,
    type:"youtube" | "x" | "document" | "link"
    _id: string
    onDelete?: (id : string) => void
}

export const Card = ({title, link, type, _id, onDelete}:cardInputInterface) => {
    return <div className={`bg-white rounded-md min-w-[350px] ${type === "youtube" ? "max-h-[235px]" : "min-h-[235px]"} border-[1px] border-slate-200 shadow-xl shadow-slate-200 flex flex-col h-full1`} key={_id}>
        <div className="flex justify-between pt-4 ">
            <div className="flex items-center gap-4 pl-2"> 
                <div className="text-[#545454] text-xl font-bold">
                    {type === "youtube" && <FaYoutube /> || type === "x" && <BsTwitterX /> || type === "document" && <IoDocumentSharp /> || type === "link" && <ImLink />}
                </div>
                <div className="text-xl font-semibold">
                    {title} 
                </div>
            </div>
            <div className="flex items-center gap-4 text-[#adb3bd] pr-2">
                <div className="text-2xl">
                <BiSolidEdit />
                </div>
                <div onClick={() => onDelete?.(_id)} className="hover:cursor-pointer">
                    <DeleteIcon />
                </div>
            </div>
        </div>
        <div className="px-4 py-4">
            {type === "youtube" && <iframe className="w-full" height="100%" src={link.replace("watch?v=","embed/")}></iframe>}
            
            {type === "x" && <blockquote className="twitter-tweet">
            <a href={link.replace("x.com", "twitter.com")}></a> 
            </blockquote>}
        </div>
    </div>
}