import { useEffect, useRef } from "react"
import { CloseIcon } from "../icons/CloseIcon"
import { Button } from "./Button"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { cardInputInterface } from "./Card";

export const Model = ({open, onClose, text, buttonText, setContent}: AddContentModelInterface) => {

    const modelRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null)
    const platformRef = useRef<HTMLInputElement | null>(null)
    const linkRef = useRef<HTMLInputElement | null>(null)

    
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

    
    const addContent = async () => {
        try{
            const token = localStorage.getItem("userAuthToken")
            const result = await axios.post(`${BACKEND_URL}/content`,{
                title: titleRef.current?.value,
                link: linkRef.current?.value,
                type: platformRef.current?.value
            },
            {
                headers:{
                    Authorization: token ? token: ""
                }
            })
            alert("added");
            console.log(result);

            const updatedResult = await axios.get(`${BACKEND_URL}/content`,{
                headers:{
                    Authorization: token ? token : ""
                }
            })
            if (setContent) {
                setContent(updatedResult.data.userContentData); // Ensure you're accessing the correct property
            }
    
            // Close the modal
            onClose();

        }catch(err){
            console.log(err);
        }
    }


    return (
        <div>
        {open && <div className="h-screen w-screen  fixed bg-opacity-50 top-0 left-0 flex justify-center items-center bg-slate-900">
            <div className="flex flex-col justify-center px-10 py-5 bg-white rounded-lg" ref={modelRef}>
                <div onClick={onClose} className="flex flex-row-reverse hover:cursor-pointer">
                    <CloseIcon />
                </div>
                <div className="font-bold text-xl text-[#5a52d2] py-5">{text}</div>
                {text === "Add Content To Your Brain" && <div>
                    <LabelledComponent label={"Title"} placeholder={"Trump Tweet"} reference={titleRef}/>
                    <LabelledComponent label={"Platform"} placeholder={"Youtube or X"} reference={platformRef}/>
                    <LabelledComponent label={"Link"} placeholder={"https://x.com/realDonaldTrump/status/1868085790485758308"} reference={linkRef}/>
                </div>}
                <Button variant={"primary"} text={buttonText} onClick={() => addContent()}/>
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
    setContent?: React.Dispatch<React.SetStateAction<cardInputInterface[]>>,
    // isEditing?: () => any
}


interface LabelledComponentInterface{
    label?:string,
    placeholder?: string
    reference?: React.RefObject<HTMLInputElement>
}

const LabelledComponent = ({label, placeholder, reference} : LabelledComponentInterface) => {
    return (
        <>
        <div className="flex flex-col mb-4">
            <label className="text-[#5a52d2] font-semibold">{label}</label>
            <input ref={reference} className="border-gray-200 border-2 rounded-md px-4 py-2" placeholder={placeholder}></input>
        </div>
        </>
    )
}