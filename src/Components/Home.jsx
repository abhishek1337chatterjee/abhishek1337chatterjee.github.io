import React from "react";
import { HiOutlineArrowNarrowRight} from "react-icons/hi";
import ProfilePic from "../Assets/profile-pic.png";
import { Typewriter } from "react-simple-typewriter";
import { FaDownload, FaGithub, FaLinkedin } from "react-icons/fa";
import { Button } from "@mui/material";
import { Link } from "react-scroll";
import Resume from "../Assets/Abhishek-Chatterjee-Resume.pdf";
export const Home = () => {
  return (
    <div name="home" className="w-full h-screen">
      {/* container */}
      <div className="max-w-[1000px] m-auto lg:mt-[150px]  pt-50 flex flex-col-reverse justify-between items-center sm:flex sm:flex-row">
        <div className=" pl-8">
          <h1 className="text-3xl sm:text-5xl text-orange-600 mt-20">Hi 👋,</h1>
          <h1 className="text-4xl sm:text-6xl font-bold text-[#ccd6f6] pt-4">
            I'm Abhishek Chatterjee
          </h1>
          <h1 className=" text-3xl text-pink-400 pt-4">
            a{" "}
            <Typewriter
              words={[
                "  Full Stack Web Developer.",
                "  Programmer.",
                "  Problem Solver.",
                "  Explorer. ",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              cursorBlinking={false}
              typeSpeed={50}
              deleteSpeed={10}
              delaySpeed={2000}
            />
          </h1>

          <div>
            <div className="pt-4 flex flex-row lg:hidden z-0">
              
                <a href={Resume} download="Abhishek-Chatterjee-Resume.pdf">
                <Button
                variant="contained"
                startIcon={<FaDownload size={20} />}
                sx={{
                  color: "white",
                  backgroundColor: "orange",
                  borderColor: "green",
                  fontWeight: "bold",
                  fontSize: "10px",
                  fontFamily: "",
                  ":hover": {
                    bgcolor: "pink",
                    color: "white",
                  },
                  width: "80px",
                  padding: "10px 40px 10px 40px",
                }}
                onClick={() => {
                  window.open(
                    "https://drive.google.com/file/d/1GJ75qUzJh6KWhj95osLf77DGmUBoUNyz/view?usp=share_link"
                  );
                }}
              >
                  Resume{" "}
                  </Button>
                </a>
              

              <Button
                variant="contained"
                startIcon={<FaGithub size={20} />}
                sx={{
                  color: "white",
                  backgroundColor: "grey",
                  borderColor: "green",
                  fontWeight: "bold",
                  fontSize: "10px",
                  fontFamily: "",
                  ":hover": {
                    bgcolor: "dark grey",
                    color: "white",
                  },
                  width: "80px",
                  padding: "10px 40px 10px 40px",
                  margin: "0px 20px 0px 20px",
                }}
              >
                <a
                  href="https://github.com/abhishek1337chatterjee"
                  target="_blank"
                >
                  {" "}
                  GitHub{" "}
                </a>
              </Button>

              <Button
                variant="contained"
                startIcon={<FaLinkedin size={20} />}
                sx={{
                  color: "white",
                  backgroundColor: "light blue",
                  borderColor: "green",
                  fontWeight: "bold",
                  fontSize: "10px",
                  fontFamily: "",
                  ":hover": {
                    bgcolor: "light blue",
                    color: "white",
                  },
                  width: "80px",
                  padding: "10px 40px 10px 40px",
                }}
              >
                <a
                  href="https://www.linkedin.com/in/abhishekchatterjee-saheb1337/"
                  target="_blank"
                >
                  {" "}
                  LinkedIn{" "}
                </a>
              </Button>
            </div>
            <Link to="work" smooth={true} offset={-100} duration={500}>
            <button className="text-white group border-2 px-6 py-3 my-2 flex items-center hover:bg-pink-600 hover:border-pink-600">
              View Work
              <span className=" group-hover:rotate-90 duration-500">
               
                  <HiOutlineArrowNarrowRight className="ml-3 cursor-none" />{" "}
              </span>
            </button>
            </Link>
          </div>
        </div>
        <div>
          <img
            src={ProfilePic}
            className="w-[200px] pt-4 md:w-[300px]  lg:w-[400px] "
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
