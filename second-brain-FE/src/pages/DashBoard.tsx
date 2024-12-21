import { Button } from '../components/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { Card, cardInputInterface } from '../components/Card'
import { Model } from '../components/AddContentModel'
import { useEffect, useState } from 'react'
import { SideBar } from '../components/SideBar'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useNavigate, useParams } from 'react-router-dom'

export const DashBoard = () => {

  const [open, setOpen] = useState(false);
  const [modelText, setModelText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(false)
  let [content, setContent] = useState<cardInputInterface[]>([]);
  const navigate = useNavigate()
  const { hash } = useParams<{ hash: string }>()
  const [sharedContent, setSharedContent] = useState<cardInputInterface[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
        try{
            const token = localStorage.getItem("userAuthToken")
            const fetchingDataResult = await axios.get(`${BACKEND_URL}/content`,{
                headers:{
                    Authorization: token ? token : ""
                }
            })
            if (fetchingDataResult.data && fetchingDataResult.data.userContentData) {
                setContent(fetchingDataResult.data.userContentData);
              } else {
                console.error('Fetched data is not valid:', fetchingDataResult.data);
                setContent([]); 
              }
        }catch(err){    
            console.log(`Error occured ${err}`)
            setContent([]);
        }
    }

    const fetchSharedContent = async () => {
      if(!hash){
        console.log("Invalid URL")
        return;
      }
      try{
        const response = await axios.get(`${BACKEND_URL}/brain/${hash}`)
        console.log(response);
        if(response.data && response.data.content){
            setSharedContent(response.data.content)
        }
        else{
          console.log(`No Shared Content found`)
        }
      }catch(err){
        alert(`Error occured while fetching the shared the content ${err}`);
      }
    }
    fetchSharedContent()
    fetchContent()
},[hash])

  const popUp = (text:string, buttonText:string) =>{
    setModelText(text)
    setOpen(true)
    setButtonText(buttonText)
  }

  const sideBarToggel = () => {
    setSideBarOpen(x => !x)
  }

  const deleteData = async (id:string) => {
    try {
      const token = localStorage.getItem("userAuthToken");
      await axios.delete(`${BACKEND_URL}/content/${id}`, {
        headers: {
          Authorization: token || "",
        },
      });

      setContent((prevContent) => prevContent.filter((item) => item._id !== id));
      alert("Content deleted successfully!");
    } catch (err) {
      console.error("Error deleting content:", err);
    }
  }

  const shareBrain = async () => {
    try {
      const token = localStorage.getItem("userAuthToken");
      const response = await axios.post(
        `${BACKEND_URL}/brain/share`,
        {share:"true"},
        {
          headers: {
            Authorization: token || "",
          },
        }
      );
      setIsSharing(true);

      if (response.data && response.data.link) {
        const hash = response.data.link;
        window.open(`/brain/${hash}`, '_blank');

        navigate(`/brain/${hash}`);
      }
    } catch (err) {
      console.error("Error sharing brain:", err);
      alert("An error occurred while sharing your brain.");
    }
  };

  const stopSharing = async () => {
    try{
      const token = localStorage.getItem("userAuthToken")
      const response = await axios.post(`${BACKEND_URL}/brain/share`,
        {share:"false"},
        {
          headers:{
            Authorization: token || ""
          }
        }
      )
      setIsSharing(false);
      console.log(response)
      if(response.data){
        alert(`Sharing Stopped successfully`);
        window.open('/dashboard', '_blank');
        navigate(`/dashboard`);
      }
    }catch(err){
      alert(`Error occured while stop sharing`);
    }
  }

  content = hash ? sharedContent : content

  return (
    <>
    <div>
      <SideBar open={sideBarOpen} onClose={sideBarToggel}/>
    </div>
    <div className="bg-[#f9fafd] h-screen">
    <div className={`${sideBarOpen ? "ml-72" : "pt-6 pl-10"}`}> 
      <div className='flex items-center justify-between'>
        <p className={`text-[#000000] text-4xl font-bold `}>All Notes</p>
      <div>
        <div className='flex flex-row-reverse gap-4 px-4 pt-4 pb-6'>
          <Button variant='secondary' text={isSharing === true ? "Stop Sharing":"Share Brain"} startIcon={<ShareIcon />} onClick={isSharing === true ? stopSharing :shareBrain} ></Button>
          <Button variant='primary' text='Add Content' startIcon={<PlusIcon />} onClick={() => popUp("Add Content To Your Brain", "Add To Brain")}></Button>
        </div>
      </div>
      </div>
    
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 mx-10 my-5 ${sideBarOpen ? "gap-x-36" :"gap-x-8"}  ${sideBarOpen ? "pr-28" :"pr-8"}`}>
    {content.length > 0 ? (
    content.map((item) => (
      <Card title={item.title} link={item.link} type={item.type} key={item._id} _id={item._id} onDelete={() => deleteData(item._id)}/>
    ))
  ) : (
    <p>No content available.</p>
  )}

    </div>
    <Model open={open} onClose={() => setOpen(false)} text={modelText} buttonText={buttonText} setContent={setContent}/>
    </div>
    </div>
    
    
    </>
  )
}