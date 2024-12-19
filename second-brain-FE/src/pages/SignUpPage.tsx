import { useRef } from "react"
import { Button } from "../components/Button"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"

export const SignUpAndSignInPage = ({type} : SignUpAndSignInPageInterface) => {
    const usernameRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const SignUpAndSignInReq = async (type : string) => {
        try{
            if(type === "Sign Up"){
                await axios.post(`${BACKEND_URL}/signup`,{
                    username:usernameRef.current?.value,
                    password:passwordRef.current?.value
                })
                navigate("/signin")
            }
            else if(type === "Sign In"){
                const result = await axios.post(`${BACKEND_URL}/signin`,{
                    username:usernameRef.current?.value,
                    password:passwordRef.current?.value
                })
                const jwtToken = result.data
                localStorage.setItem("userAuthToken",jwtToken);
                navigate("/dashboard");
            }
        }catch(err){
            if(axios.isAxiosError(err) && err.response){
                console.log(err);
                alert(err.response.data)
            }
            else{
                alert("an unexpected error occured")
            }
        }   
    }

    return (
        <>
        <div className="flex flex-col items-center h-screen justify-center">
            <div className=" border-slate-300 border-2 rounded-md px-10 py-10 flex flex-col gap-10">
                <p className="text-[#5046e4] font-bold text-3xl">{type} On Second Brain App</p>
                <LabelledComponent label={"Username"} placeholder={"jhonedoe123"} reference={usernameRef}/>
                <LabelledComponent label={"Password"} placeholder={"jhonedoe@123"} type={"password"} reference={passwordRef}/>
                <div className="flex justify-center">
                <Button variant={"primary"} text={`${type === "Sign Up" ? "Sign Up" : "Sign In"}`} onClick={()=>SignUpAndSignInReq(type)}/>
                </div>
            </div>
        </div>
        </>
    )
}


interface LabelledComponentInterface{
    label:string,
    placeholder:string,
    type?: string | "text"
    reference?: React.RefObject<HTMLInputElement>
}

interface SignUpAndSignInPageInterface{
    type:string
}

const LabelledComponent = ({label, placeholder, type, reference}:LabelledComponentInterface) => {
    return(
        <div className="flex flex-col gap-2">
            <label className="font-semibold text-xl">{label}</label>
            <input ref={reference} placeholder={placeholder} type={type} className="px-4 py-2 border-slate-200 border-2 rounded-lg"></input>
        </div>
    )
}