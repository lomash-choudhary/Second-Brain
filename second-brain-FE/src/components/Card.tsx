import { DeleteIcon } from "../icons/DeleteIcon"
import { BiSolidEdit } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { ImLink } from "react-icons/im";
import { cleanYoutubeUrl } from "../helpers/youtubeUrlCleaner";

export interface cardInputInterface {
    title: string,
    link: string,
    type: "youtube" | "x" | "document" | "link"
    _id: string
    onDelete?: (id: string) => void
    isSideBarOpen?: boolean
    isEditing?: () => void
}

export const Card = ({ title, link, type, _id, onDelete, isSideBarOpen, isEditing}: cardInputInterface) => {
    return (
        <div 
            className={`bg-white rounded-md w-[350px] ${
                type === "youtube" ? "h-[255px]" : "h-fit"
            } border-[1px] border-slate-200 shadow-xl shadow-slate-200 flex flex-col overflow-hidden`}
            key={_id}
        >
            <div className="flex justify-between pt-4">
                <div className="flex items-center gap-4 pl-2"> 
                    <div className="text-[#545454] text-xl font-bold">
                        {type === "youtube" && <FaYoutube /> || 
                         type === "x" && <BsTwitterX /> || 
                         type === "document" && <IoDocumentSharp /> || 
                         type === "link" && <ImLink />}
                    </div>
                    <div 
                        className={`text-xl font-semibold truncate ${
                            isSideBarOpen ? "w-[180px]" : "w-[220px]"
                        }`}
                        title={title}
                    >
                        {title}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[#adb3bd] pr-2" onClick={isEditing}>
                    <div className="text-2xl">
                        <BiSolidEdit />
                    </div>
                    <div onClick={() => onDelete?.(_id)} className="hover:cursor-pointer">
                        <DeleteIcon />
                    </div>
                </div>
            </div>
            <div className="p-4 flex-1">
                {type === "youtube" && (
                    <div className="relative w-full h-full">
                        <iframe 
                            className="absolute inset-0 w-full h-full"
                            src={cleanYoutubeUrl(link)}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                
                {type === "x" && (
                    <blockquote className="twitter-tweet">
                        <a href={link.replace("x.com", "twitter.com")}></a> 
                    </blockquote>
                )}
            </div>
        </div>
    );
}