import { ReactElement } from "react"

interface ButtonProps{
    variant : "primary" | "secondary",
    text: string,
    startIcon: ReactElement
}

const variantObject = {
    "primary":"bg-[#5046e4] text-[#e1dffa]",
    "secondary": "bg-[#e0e7ff] text-[#5a52d2]"
}

const defaultStyles = "px-6 py-2 rounded-sm"

export const Button = ({variant, text, startIcon} : ButtonProps) => {
    return <button className={`${variantObject[variant]} ${defaultStyles} flex gap-2 items-center`}>
        {startIcon}
        {text}
    </button>
}   