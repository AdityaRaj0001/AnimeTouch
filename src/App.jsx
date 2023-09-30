import React, { useState } from "react"
import axios from "axios"
import { saveAs } from "file-saver"

function App() {

  
  const [imageb64,setImageb64] = useState("");
  const [loading, setLoading] = useState(false);
  const [generateclicked,setGenerateclicked]=useState(false)
  const [responseimageb64,setResponseimageb64]=useState("");



const handleImageUpload=(e)=>{
  const file=e.target.files[0]
   
  if(file){
    const reader = new FileReader();


    reader.onload = function (e) {

      const base64Image=e.target.result.split(',')[1];
      setImageb64(base64Image)
    }
    reader.readAsDataURL(file);
  }


}
const retry=()=>{

  setImageb64("")
  setGenerateclicked(false)
  setResponseimageb64("")
}

const download=()=>{
  if(responseimageb64){
    // Convert base64 to a Blob
    const byteCharacters = atob(responseimageb64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' }); // Adjust the type as needed

    // Trigger the download using file-saver
    saveAs(blob, 'downloaded_image.png');
  }
}

const GenerateResult= async (e)=>{
 e.preventDefault();
 setLoading(true);
 setGenerateclicked(true)

 const requestBody={
  model:'dark-sushi-mix-v2-25',
  prompt: "Animated Version, Ultra High Quality, HD, Hyperrealistic",
  negative_prompt: "Disfigured, cartoon, blurry, nude",
  image:imageb64,
  strenght:0.4,
  steps:50,
  guidance:9,
  scheduler:"dpmsolver++",
  output_format:"png"
 } 

 try {
  
    const response =await axios.post("https://api.getimg.ai/v1/stable-diffusion/image-to-image",
    requestBody, 
    {
      headers:{
        "Authorization":import.meta.env.getimgapikey,
        Accept:'application/json',
        'Content-Type':"application/json",
      },
    }
    )

    
    const responseimage=response.data.image;
    setResponseimageb64(responseimage)
    console.log(responseimageb64)

 } catch (error) {
  console.error("An error occurred",error)
  
 } finally {
  setLoading(false)
 }

}


  return (
    <>
    <div className="inputside">

      
      { !generateclicked &&  (
        <>
        {
         !imageb64 && <input type="file" accept="image/jpeg,image/png" onChange={handleImageUpload}></input>
        }
        <button onClick={GenerateResult} >Generate</button>
        </>
      )}

      {imageb64 &&  <img src={`data:image/jpeg;base64,${imageb64}`}  />}

    </div>

    <div className="outputside">
      {loading && <h1>Loading.. Please wait brother</h1>}

    {responseimageb64 && 
    
    (
<>

    <img src={`data:image/png;base64,${responseimageb64}`} />
      <button onClick={retry}>Retry</button>
    <button onClick={download}>Download</button></>
      
    )
    }
    

    </div>
      
    </>
  )
}

export default App
