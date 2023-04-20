import React, { useState } from "react";
import Logo from "../Assets/Logo.png";
import { Link } from "react-scroll";
import {
  FaBars,
  FaTimes,
  FaDownload,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { Button } from "@mui/material";
import Resume from "../Assets/Abhishek-Chatterjee-Resume.pdf";
export const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleClickHam = () => {
    setNav(!nav);
  };
  return (
    <div className="sticky top-0 w-full h-[85px] flex justify-between items-center px-4 bg-[#000] text-white z-50">
      <div>
        <Link to="home" smooth={true} offset={-500} duration={500}>
          <img src={Logo} alt="Logo Image" style={{ width: "102px" }} />
        </Link>
      </div>
      {/* menu */}
      <ul className="hidden md:flex">
        <li>
          <Link to="home" smooth={true} offset={-500} duration={500}>
            <p className="text-2xl">Home</p>{" "}
          </Link>
        </li>
        <li>
          <Link to="about" smooth={true} offset={10} duration={500}>
            <p className="text-2xl">About Me</p>{" "}
          </Link>
        </li>
        <li>
          <Link to="skills" smooth={true} offset={-100} duration={500}>
            <p className="text-2xl">Skills</p>{" "}
          </Link>
        </li>
        <li>
          <Link to="work" smooth={true} offset={-120} duration={500}>
            <p className="text-2xl"> Projects</p>{" "}
          </Link>
        </li>
        <Link to="github" smooth={true} offset={-100} duration={500}>
          <p className="text-2xl cursor-pointer"> GitHub </p>{" "}
        </Link>
        <li>
          <Link to="contact" smooth={true} offset={-120} duration={500}>
            <p className="text-2xl"> Contact Me </p>{" "}
          </Link>
        </li>
        <li>
          {/* <Button
            variant="contained"
            startIcon={<FaDownload />}
            sx={{
              color: "white",
              backgroundColor: "orange",
              borderColor: "green",
              fontWeight: "bolder",
              fontFamily: "",
              ":hover": {
                bgcolor: "pink",
                color: "white",
              },
            }}
            onClick={() => {
              window.open(
                "https://drive.google.com/file/d/1GJ75qUzJh6KWhj95osLf77DGmUBoUNyz/view?usp=share_link"
              );
            }}
          >
            <a
              href={Resume}
              download
            >
              Resume
            </a>
          </Button> */}
          <a
              href={Resume}
              download
            >
              <Button
            variant="contained"
            startIcon={<FaDownload />}
            sx={{
              color: "white",
              backgroundColor: "orange",
              borderColor: "green",
              fontWeight: "bolder",
              fontFamily: "",
              ":hover": {
                bgcolor: "pink",
                color: "white",
              },
            }}
            onClick={() => {
              window.open(
                "https://drive.google.com/file/d/1GJ75qUzJh6KWhj95osLf77DGmUBoUNyz/view?usp=share_link"
              );
            }}
          >
            
              Resume
          </Button>
            </a>
        </li>
      </ul>

      {/* hamdburger */}
      <div onClick={handleClickHam} className="md:hidden z-10">
        {nav ? <FaTimes /> : <FaBars />}
      </div>

      {/* mobile */}

      <ul
        className={
          !nav
            ? "hidden"
            : " absolute top-0 left-0 w-full h-screen bg-[#000] flex flex-col justify-center items-center"
        }
      >
        <li className="py-6">
          {" "}
          <Link
            onClick={handleClickHam}
            to="home"
            smooth={true}
            offset={-500}
            duration={500}
          >
            <p className="text-4xl">Home</p>{" "}
          </Link>
        </li>
        <li>
          {" "}
          <Link
            onClick={handleClickHam}
            to="about"
            smooth={true}
            offset={10}
            duration={500}
          >
            <p className="text-4xl">About Me</p>{" "}
          </Link>
        </li>
        <li className="py-6">
          <Link
            onClick={handleClickHam}
            to="skills"
            smooth={true}
            offset={-100}
            duration={500}
          >
            <p className="text-4xl">Skills</p>{" "}
          </Link>
        </li>
        <li className="py-6">
          {" "}
          <Link
            onClick={handleClickHam}
            to="work"
            smooth={true}
            offset={-100}
            duration={500}
          >
            <p className="text-4xl"> Projects</p>{" "}
          </Link>
        </li>
        <li className="py-3 cursor-pointer">
          {" "}
          <Link
            onClick={handleClickHam}
            to="github"
            smooth={true}
            offset={-100}
            duration={500}
          >
            <p className="text-4xl"> GitHub</p>{" "}
          </Link>
        </li>
        <li className="py-6">
          {" "}
          <Link
            onClick={handleClickHam}
            to="contact"
            smooth={true}
            offset={-200}
            duration={500}
          >
            <p className="text-4xl"> Contact Me </p>{" "}
          </Link>
        </li>
        <li className="py-6">
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
            <a
              href={Resume}
              download
            >
              Resume{" "}
            </a>
          </Button>
        </li>
      </ul>
      {/* Social Media Icons */}

      <div className="hidden  lg:flex fixed flex-col top-[35%] left-0">
        <ul>
          <li className="w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-500 bg-blue-700">
            <a
              className="flex justify-between items-center w-full text-gray-300"
              href="https://www.linkedin.com/in/abhishekchatterjee-saheb1337/"
              target="_blank"
            >
              LinkedIn <FaLinkedin size={30} />
            </a>
          </li>
        </ul>
        <ul>
          <li className="w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-500 bg-[#333333]">
            <a
              className="flex justify-between items-center w-full text-gray-300"
              href="https://github.com/abhishek1337chatterjee"
              target="_blank"
            >
              Github
              <FaGithub size={30} />
            </a>
          </li>
        </ul>
        <ul>
          <li className="w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-500 bg-[#6fc2b0]">
            <a
              className="flex justify-between items-center w-full text-gray-300"
              href="mailto:abhishek1337chatterjee@gmail.com"
            >
              Email <HiOutlineMail size={30} />
            </a>
          </li>
        </ul>
        <ul>
          <li
            onClick={() => {
              window.open(
                "https://drive.google.com/file/d/1GJ75qUzJh6KWhj95osLf77DGmUBoUNyz/view?usp=share_link"
              );
            }}
            className="w-[160px] h-[60px] flex justify-between items-center ml-[-100px] hover:ml-[-10px] duration-500 bg-[#565f69]"
          >
            <a
              className="flex justify-between items-center w-full text-gray-300"
              href={Resume}
              download
            >
              Resume <BsFillPersonLinesFill size={30} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
