import { useEffect, useRef } from "react"
import { CloseIcon } from "../icons/CloseIcon"
import { Button } from "./Button"

export const Model = ({open, onClose, text, buttonText}: AddContentModelInterface) => {

    const modelRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        if(!open) return;
        const handleClickOutside = (event: MouseEvent) => {
            if(modelRef.current && !modelRef.current.contains(event.target as Node)){
                onClose()
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return() => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    },[open, onClose])


    return (
        <div>
        {open && <div className="h-screen w-screen  fixed bg-opacity-50 top-0 left-0 flex justify-center items-center bg-slate-900">
            <div className="flex flex-col justify-center px-10 py-5 bg-white rounded-lg" ref={modelRef}>
                <div onClick={onClose} className="flex flex-row-reverse hover:cursor-pointer">
                    <CloseIcon />
                </div>
                <div className="font-bold text-xl text-[#5a52d2] py-5">{text}</div>
                {text === "Add Content To Your Brain" && <div>
                    <LabelledComponent label={"Title"} placeholder={"Trump Tweet"}/>
                    <LabelledComponent label={"Platform"} placeholder={"Twitter or X"}/>
                    <LabelledComponent label={"Link"} placeholder={"https://x.com/realDonaldTrump/status/1868085790485758308"}/>
                </div>}
                <Button variant={"primary"} text={buttonText}/>
            </div>
            
        </div>}

        </div>
    )
}

interface AddContentModelInterface {
    open: boolean,
    onClose: () => void,
    text: string,
    buttonText: string
}


interface LabelledComponentInterface{
    label?:string,
    placeholder?: string
}

const LabelledComponent = ({label, placeholder} : LabelledComponentInterface) => {
    return (
        <>
        <div className="flex flex-col mb-4">
            <label className="text-[#5a52d2] font-semibold">{label}</label>
            <input className="border-gray-200 border-2 rounded-md px-4 py-2" placeholder={placeholder}></input>
        </div>
        
        </>
    )
}