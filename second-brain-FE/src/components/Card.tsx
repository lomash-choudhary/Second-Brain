import { DeleteIcon } from "../icons/DeleteIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { ImLink } from "react-icons/im";

interface cardInputInterface{
    title:string,
    link:string,
    type:"youtube" | "twitter" | "document" | "link"
}

export const Card = ({title, link, type}:cardInputInterface) => {
    return <div className={`bg-white rounded-md min-w-[350px] ${type === "youtube" ? "max-h-[235px]" : "min-h-[235px]"} border-[1px] border-slate-200 shadow-xl shadow-slate-200 flex flex-col h-full1`}>
        <div className="flex justify-between pt-4 ">
            <div className="flex items-center gap-4 pl-2"> 
                <div className="text-[#545454] text-xl font-bold">
                    {type === "youtube" && <FaYoutube /> || type === "twitter" && <BsTwitterX /> || type === "document" && <IoDocumentSharp /> || type === "link" && <ImLink />}
                </div>
                <div className="text-xl font-semibold">
                    {title} 
                </div>
            </div>
            <div className="flex items-center gap-4 text-[#adb3bd] pr-2">
                <ShareIcon />
                <DeleteIcon />
            </div>
        </div>
        <div className="px-4 py-4">
            {type === "youtube" && <iframe className="w-full" height="100%" src={link.replace("watch?v=","embed/")}></iframe>}
            
            {type === "twitter" && <blockquote className="twitter-tweet">
            <a href={link.replace("x.com", "twitter.com")}></a> 
            </blockquote>}
        </div>
    </div>
}