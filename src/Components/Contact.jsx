import { Button } from "@mui/material";
import React, { useState } from "react";
import Resume from "../Assets/Abhishek_Chatterjee_Resume.pdf";
import { FaDownload, FaGithub, FaLinkedin } from "react-icons/fa";

const initialState = {
  email: "",
  name: "",
  message: "",
};

export const Contact = () => {
  const [values, setValues] = useState(initialState);
  const [right, setRigt] = useState(false);
  const handleSubmit = () => {
    if (values.email === "" || values.name === "" || values.message === "") {
      setRigt(false);
      alert("Please enter all fields");
      window.location.reload();
      return;
    }
    setRigt(true);
  };
  return (
    <div
      name="contact"
      className="w-full h-screen flex justify-center items-center p-4 mt-10"
    >
      <form
        action={
          right
            ? "https://getform.io/f/8775dab5-b30d-48fc-9d52-4900b095464c"
            : ""
        }
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col max-w-[600px] w-full
        "
        target="_blank"
        
      >
        <div className="mt-20 pb-8 text-center">
          <p className="text-4xl font-bold inline border-b-4 border-pink-600 text-gray-300">
            Contact
          </p>
          <p className="text-gray-300 py-4">
            {" "}
            Sumbit the form below or Email me at{" "}
            <span className="text-pink-300">
              {" "}
              abhishek1337chatterjee@gmail.com{" "}
            </span>{" "}
          </p>
          <p className="text-gray-300 py-4">
            {" "}
            Connect me via whatsapp or call :{" "}
            <span className="text-pink-300"> +918420739602 </span>{" "}
          </p>
        </div>
        <div className="pb-8 m-auto flex flex-row lg:hidden z-0">
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
              download="fw20_1254-Abhishek-Chatterjee-Resume.pdf"
            >
              Resume{" "}
            </a>
          </Button>

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
            <a href="https://github.com/abhishek1337chatterjee" target="_blank">
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
        <input
          className="bg-[#ccd6f6] p-2"
          type="text"
          value={values.name}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Name"
          name="name"
        />
        <input
          className="my-4 p-2 bg-[#ccd6f6]"
          type="email"
          value={values.email}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Email"
          name="name"
        />
        <textarea
          className="bg-[#ccd6f6] p-2"
          name="message"
          rows="10"
          value={values.message}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, message: e.target.value }))
          }
          placeholder="Message"
        ></textarea>
        <button className="text-white border-2 hover:bg-pink-600 hover:border-pink-600 px-4 py-3 my-8 mx-auto flex items-center">
          Send
        </button>
      </form>
    </div>
  );
};
