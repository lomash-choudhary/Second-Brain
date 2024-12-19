import { Button } from "../components/Button"

export const FirstPage = () => {
    return (
        <>
        <div className="flex flex-col items-center gap-20">
            <div className="flex pt-10 flex-col items-center gap-4">
                <div className="flex flex-col gap-12 items-center">
                <div className="text-[#5046e4] font-bold text-5xl">
                    Welcome To Second Brain App
                </div>
                <div className="text-3xl font-semibold w-[900px]">
                    Here You Can Add All Your Data Which Is Precious To You And You 
                </div>
                </div>
                <span className=" text-3xl font-semibold text-red-600">DON'T WANNA LOSE IT</span>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex justify-center items-center gap-8">
                    <p className="font-semibold text-2xl w-[300px]">Are You New To Our App?</p>
                    <Button variant={"primary"} text={"Sign Up"} refUrl="/signup" loading={false} loadingText={"Sign Up"}/>
                </div>
                <div className="flex justify-center items-center gap-8">
                    <p className="font-semibold text-2xl w-[300px]">Your Brain Thinks We Have Meet Before?</p>
                    <Button variant={"secondary"} text={"Sign In"} refUrl="/signin" loading={false} loadingText={"Sign In"}/>
                </div>
            </div>
        </div>
        
        </>
    )
}