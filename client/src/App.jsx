import { useState } from 'react';
import { LuImageUp } from "react-icons/lu";
import Header from './components/Header';
import toast, { Toaster } from 'react-hot-toast';
import { FaCat } from 'react-icons/fa';
import Footer from './components/Footer';

function App() {
  const [image,setImage] = useState(null);
  const [apiResponse,setApiResponse] = useState(null);
  const toastMessages = [
    "Praying to the Cat God to spare you... ",
    "Analyzing your cat's evil aura... ",
    "Calling the feline exorcist...",
    "Checking if your will is in order...",
    "Uploading data to MeowGPT...",
    "Offering treats for mercy...",
    "Purring through deep analysis...",
    "Running... before it's too late"
  ];
  async function catAnalyze(){
    const toastId = toast.loading(toastMessages[Math.floor(Math.random() * toastMessages.length)]);
    try{
    const fileInput = document.getElementById('uploadfile');
    const file = fileInput.files[0];
    if(!file) return toast.error("No cat detected");
    const formData = new FormData();
    formData.append('uploadfile', file);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/fileupload`, {
      method: 'POST',
      body: formData
  });
    const data = await response.json();
    setApiResponse(data);
    console.log(data);
    toast.success('success');
    }catch(err){
      toast.error("some error occurred");
        console.log(err);
    }finally{
      toast.dismiss(toastId);
    }
  }

  function setImage_(e){
    const file = e.target.files[0];
    if (file) {
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
    }
  }


  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}/>
      <Header/>
    <div className='pt-20'>
      <div className='flex flex-col justify-center items-center gap-5' id="analyze">
      <p className='text-[#E3285D] font-extrabold text-3xl'>Is My Cat Plotting to Kill Me?</p>
      <p className='text-[#475569] text-xl'>Ever Wondered if Your Cat Is Planning Your Downfall? We've Got the Answers.</p>
     <form encType="multipart/form-data" className='w-[50%]'>
          <input type="file" name="uploadfile" id="uploadfile" onChange={(e)=>setImage_(e)}
          className='hidden'/>
          <label htmlFor='uploadfile' className='h-52 justify-center relative w-full py-3 px-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 flex flex-col items-center'>
          <div className='text-[#808694]'><LuImageUp  size={30}/></div>
            <p className='text-[#808694]'>click to upload or drag and drop image</p>
          </label>
          {image && <img src={image} className='h-32 mx-auto mt-4 rounded-lg'></img>}
     </form>
     <button onClick={catAnalyze} className='cursor-pointer bg-[#F5A3C5] p-2 text-white rounded-md hover:bg-[#E3285D]'>Is My Cat a Killer?</button>
     </div>
     {apiResponse && 
        <div className='bg-white rounded-md m-10 ml-40 mr-40 p-10 text-[#475569]'>
          {apiResponse?.catDetection?.isCat &&
          <div className='pb-4'>
           <div className='border-l-[#E3285D] border-l-4 p-4'>
           <p className='text-[#E3285D] font-black'>Mood Detected</p>
            <p>{apiResponse?.catDetection?.emotion}</p>
          </div>
        </div>
        }
       {/* <pre className="whitespace-pre-wrap break-words">{JSON.stringify(apiResponse, null, 2)}</pre> */}
       <p>{apiResponse.groqResponse}</p>
       {!apiResponse?.catDetection?.isCat && 
       <div className='border-l-[#CC2F5C] border-l-4 p-4'>
       <p className='text-[#CC2F5C]'>No Cat Detected</p>
       </div>
       }
      </div>
      }
      <div className='flex flex-col justify-center items-center' id="about">
      <div className='bg-white rounded-md m-10 ml-40 mr-40 p-10 w-[50%] flex flex-col justify-center items-center'>
      <div className='pb-10 text-[#CC2F5C]'><FaCat size={40}/></div>
        <div className='flex flex-row justify-center items-center gap-10'>
          <div className='flex flex-col justify-center items-center'>
            <div className='font-bold text-xl text-[#E3285D]'>1000+</div>
            <div>cat Analyzed</div>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <div className='font-bold text-xl text-[#E3285D]'>70%</div>
            <div>Ploting</div>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <div className='font-bold text-xl text-[#E3285D]'>98%</div>
            <div>Accuracy</div>
          </div>
          </div>
      </div>
      </div>
      <Footer/>
     </div>
    </div>
  );
}

export default App;