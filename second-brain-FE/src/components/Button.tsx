import { ReactElement } from "react"

interface ButtonProps{
    variant : "primary" | "secondary",
    text: string,
    startIcon?: ReactElement,
    onClick?: () => void
}

const variantObject = {
    "primary":"bg-[#5046e4] text-[#e1dffa] hover:bg-[#372eb6] transition ease-in",
    "secondary": "bg-[#e0e7ff] text-[#5a52d2] hover:bg-[#a0b2f3] transition ease-in"
}

const defaultStyles = "px-6 py-2 rounded-sm"

export const Button = ({variant, text, startIcon, onClick} : ButtonProps) => {
    return <button className={`${variantObject[variant]} ${defaultStyles} flex gap-2 items-center rounded-[10px] justify-center`} onClick={onClick}>
        {startIcon}
        {text}
    </button>
}   