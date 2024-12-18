import { LuBrain } from "react-icons/lu";
import { BsTwitterX } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { ImLink } from "react-icons/im";
import { FaHashtag } from "react-icons/fa";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";

export const SideBar = ({open, onClose}:SideBarInterface) => {
    return (
        <div>
            <div onClick={onClose} className={`text-3xl bg-[#f9fafd] fixed top-0 left-0 cursor-pointer`}>
                {open ? <TbLayoutSidebarLeftCollapseFilled />:<TbLayoutSidebarRightCollapseFilled />}
            </div>
            {open && <div className="w-64 top-0 left-0 fixed border-r-2 bottom-0 bg-white transition-transform duration-500 ease-in-out">
            <div className="pt-4 pl-2">
                <div className="flex items-center justify-between pr-2">
                    <a className="flex items-center gap-4" href="#">
                        <div className="text-[#5046e4] font-semibold text-3xl">
                            <LuBrain />
                        </div>
                        <p className="font-semibold text-2xl">Second Brain</p>
                    </a>
                    <div onClick={onClose} className={`text-3xl ${open ? "" :"fixed top-0 left-0"} hover:cursor-pointer`}>
                        {open ? <TbLayoutSidebarLeftCollapseFilled />:<TbLayoutSidebarRightCollapseFilled />}
                    </div>
                </div>
            <div className="flex flex-col gap-8 pt-8 ml-2">
            <div className="flex items-center gap-2 font-semibold text-lg hover:bg-slate-200 w-[100px] hover:p-2 hover:rounded-md cursor-pointer transition-all duration-500">
                <BsTwitterX />
                Tweet
            </div>
            <div className="flex items-center gap-2 font-semibold text-lg hover:bg-slate-200 w-[100px] hover:p-2 hover:rounded-md cursor-pointer transition-all duration-500">
                <FaYoutube />
                Videos
            </div>
            <div className="flex items-center gap-2 font-semibold text-lg hover:bg-slate-200 w-[150px] hover:p-2 hover:rounded-md cursor-pointer transition-all duration-500">
                <IoDocumentSharp />
                Documents
            </div>
            <div className="flex items-center gap-2 font-semibold text-lg hover:bg-slate-200 w-[100px] hover:p-2 hover:rounded-md cursor-pointer transition-all duration-500">
                <ImLink />
                Links
            </div>
            <div className="flex items-center gap-2 font-semibold text-lg hover:bg-slate-200 w-[100px] hover:p-2 hover:rounded-md cursor-pointer transition-all duration-500">
                <FaHashtag />
                Tags
            </div>
        </div>
        </div>
        
    </div>}
    </div>
    )
}

interface SideBarInterface{
    open:boolean,
    onClose: () => void
}