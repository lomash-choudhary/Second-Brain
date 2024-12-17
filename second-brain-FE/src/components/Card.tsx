import { DeleteIcon } from "../icons/DeleteIcon"
import { ShareIcon } from "../icons/ShareIcon"

interface cardInputInterface{
    title:string,
    link:string,
    type:"youtube" | "twitter"
}


export const Card = ({title, link, type}:cardInputInterface) => {
    return <div className="bg-white rounded-md min-w-[350px] min-h-[235px] border-[1px] border-slate-200 shadow-xl shadow-slate-200 flex flex-col h-full">
        <div className="flex justify-between pt-4 ">
            <div className="flex items-center gap-4 pl-2"> 
                <div className="text-[#6b7280]">
                    <ShareIcon />
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