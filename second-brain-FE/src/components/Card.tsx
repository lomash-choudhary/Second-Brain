import { DeleteIcon } from "../icons/DeleteIcon"
import { ShareIcon } from "../icons/ShareIcon"

export const Card = () => {
    return <div className="bg-white rounded-md max-w-[350px] min-h-[100px] border-[1px] border-slate-200 shadow-xl shadow-slate-200">
        <div className="flex justify-between pt-4 ">
            <div className="flex items-center gap-4 pl-2"> 
                <div className="text-[#6b7280]">
                    <ShareIcon />
                </div>
                <div className="text-xl font-semibold">
                    Project Ideas 
                </div>
            </div>
            <div className="flex items-center gap-4 text-[#adb3bd] pr-2">
                <ShareIcon />
                <DeleteIcon />
            </div>
        </div>
        <div className="px-4 py-4">
            <iframe className="w-full" height="100%" src="https://www.youtube.com/embed/0BjlBnfHcHM?si=YNRY2EP7PGssN8xy"></iframe>
            {/* <blockquote className="twitter-tweet">
            <a href="https://twitter.com/wojakcodes/status/1864967266577846555"></a> 
            </blockquote> */}
        </div>
    </div>
}