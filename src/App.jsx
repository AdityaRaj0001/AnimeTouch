import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

function App() {
  const [imageb64, setImageb64] = useState("");
  const [loading, setLoading] = useState(false);
  const [generateclicked, setGenerateclicked] = useState(false);
  const [responseimageb64, setResponseimageb64] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const base64Image = e.target.result.split(",")[1];
        setImageb64(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };
  const retry = () => {
    setImageb64("");
    setGenerateclicked(false);
    setResponseimageb64("");
  };

  const download = () => {
    if (responseimageb64) {
      // Convert base64 to a Blob
      const byteCharacters = atob(responseimageb64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" }); // Adjust the type as needed

      // Trigger the download using file-saver
      saveAs(blob, "downloaded_image.png");
    }
  };

  const GenerateResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGenerateclicked(true);
    console.log(import.meta.env.VITE_KEY);

    const requestBody = {
      model: "dark-sushi-mix-v2-25",
      prompt: "Animated version, High Quality, HD",
      negative_prompt: "Disfigured, cartoon, blurry, nude",
      image: imageb64,
      strenght: 0.20,
      steps: 50,
      guidance: 7,
      scheduler: "dpmsolver++",
      output_format: "png",
    };

    try {
      const response = await axios.post(
        "https://api.getimg.ai/v1/stable-diffusion/image-to-image",
        requestBody,
        {
          headers: {
            Authorization: import.meta.env.VITE_KEY,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const responseimage = response.data.image;
      setResponseimageb64(responseimage);
      console.log(responseimageb64);
    } catch (error) {
      console.error("An error occurred", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

    <div className="flex h-3/4 w-full relative">

      <h1 className="absolute top-4 w-full text-center font-bold text-2xl ">Anime Touch</h1>




    <div className="inputside w-1/2 flex flex-col gap-16 items-center justify-center p-4">
        {!imageb64 && (
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageUpload} className="border-black border-4 w-full sm:w-2/3 sm:max-w-[300px]" 
          ></input>
        )}

        {imageb64 && <img className="w-full sm:max-h-[500px] sm:w-auto" src={`data:image/jpeg;base64,${imageb64}`} />}
        {imageb64 && !generateclicked && <button onClick={GenerateResult} className="border-slate-900 border-4 w-full p-2 text-2xl font-semibold  text-white bg-blue-500">Generate</button>}
      </div>

      <div className="outputside relative w-1/2 flex flex-col gap-16 items-center justify-center p-4 ">
        {loading && <h1 className="font-semi-bold text-sm p-5 ">Loading.. Please wait </h1>}

        {responseimageb64 && (
          <>
            <img src={`data:image/png;base64,${responseimageb64}`} className="w-full sm:max-h-[500px] sm:w-auto" />
            

            <div className="absolute bottom-[16%] lg:bottom-[0%] text-center translate-y-[100%]">
            <button onClick={download} className="border-slate-900 border-4 w-4/5 p-2 text-2xl font-semibold  text-white bg-blue-500">Download</button>
            <button onClick={retry} className="border-slate-900 border-4 w-4/5 p-2 text-2xl font-semibold  text-white bg-blue-500">Retry</button>
            </div>
           
          </>
        )}
      </div>



    </div>

      
    </>
  );
}

export default App;
