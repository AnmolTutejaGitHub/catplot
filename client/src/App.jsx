import { useState } from 'react';
import { LuImageUp } from "react-icons/lu";
function App() {
  const [image,setImage] = useState(null);
  async function catAnalyze(){
    const fileInput = document.getElementById('uploadfile');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('uploadfile', file);
    const uploadResponse = await fetch(`http://localhost:8080/fileupload`, {
      method: 'POST',
      body: formData
  });
    const data = await uploadResponse.json();
    console.log(data);
  }

  function setImage_(e){
    const file = e.target.files[0];
    if (file) {
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
    }
  }


  return (
    <div className='mt-44'>
      <div className='flex flex-col justify-center items-center gap-5'>
     <form encType="multipart/form-data" className='w-[50%]'>
          <input type="file" name="uploadfile" id="uploadfile" onChange={(e)=>setImage_(e)}
          className='hidden'/>
          <label htmlFor='uploadfile' className='h-52 justify-center relative w-full py-3 px-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 flex flex-col items-center'>
          <div className='text-[#808694]'><LuImageUp  size={30}/></div>
            <p className='text-[#808694]'>click to upload or drag and drop image</p>
          </label>
          {image && <img src={image} className='h-32 mx-auto mt-4 rounded-lg'></img>}
     </form>
     <button onClick={catAnalyze} className='cursor-pointer bg-[#009866] p-2 text-white rounded-md'>Is My Cat a Killer?</button>
     </div>
    </div>
  );
}

export default App;