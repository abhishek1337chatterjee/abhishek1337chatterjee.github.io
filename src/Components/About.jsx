import React from "react";
import Resume from "../Assets/Abhishek-Chatterjee-Resume.pdf";
import { Button } from "@mui/material";
import { FaDownload } from "react-icons/fa";
export const About = () => {
  return (
    <div name="about" className="w-full h-screen bg-[#0a192f] text-gray-300">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="max-w-[1000px] w-full">
          <div className="sm: text-center pb-8 pl-4">
            <p
              className="text-4xl font-bold inline border-b-4 border-pink-600
                    "
            >
              About
            </p>
          </div>
        </div>
        <div className="max-w-[1000px] w-full px-6">
          <p className=" text-justify text-xl mb-[50px] lg:text-4xl">
            I am a highly determined, passionate and an enthusiastic Full Stack
            Developer. I focus on writing clean, elegant and efficient codes. I
            love combining the worlds of logic , accessible, and user-friendly
            websites and applications. Apart from coding, I love watching and
            playing cricket and also love to assemble PCs. I am eagerly
            looking forward to kickstart my career and continue refining my
            skills with the right organization.
          </p>
        </div>
        <Button
                variant="contained"
                startIcon={<FaDownload size={20} />}
                sx={{
                  color: "white",
                  backgroundColor: "orange",
                  borderColor: "green",
                  fontWeight: "bold",
                  fontSize: "15px",
                  fontFamily: "",
                  ":hover": {
                    bgcolor: "pink",
                    color: "white",
                  },
                  width: "120px",
                  padding: "10px 40px 10px 40px",
                }}
                onClick={() => {
                  window.open(
                    "https://drive.google.com/file/d/1GJ75qUzJh6KWhj95osLf77DGmUBoUNyz/view?usp=share_link"
                  );
                }}
              >
                <a href={Resume} download="fw20_1254-Abhishek-Chatterjee-Resume.pdf">
                  Resume{" "}
                </a>
              </Button>
      </div>
    </div>
  );
};
