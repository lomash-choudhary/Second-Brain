import { ReactElement } from "react"

interface ButtonProps{
    variant : "primary" | "secondary",
    text: string,
    startIcon?: ReactElement,
    onClick?: () => void,
    refUrl?: string,
    loading?: boolean,
    loadingText?: string
}

const variantObject = {
    "primary":"bg-[#5046e4] text-[#e1dffa] hover:bg-[#372eb6] transition ease-in",
    "secondary": "bg-[#e0e7ff] text-[#5a52d2] hover:bg-[#a0b2f3] transition ease-in",
}

const defaultStyles = "px-6 py-2 rounded-sm"

export const Button = ({variant, text, startIcon, onClick, refUrl, loading, loadingText} : ButtonProps) => {
    return( 
    <a href={refUrl}>
        <button className={`${variantObject[variant]} ${defaultStyles} flex gap-2 items-center rounded-[10px] justify-center w-full`} onClick={onClick} disabled={loading} >
            {startIcon}
            {loading === true ? loadingText : text}
        </button>
    </a> 
    
   )
}   