import React from "react";
import Pear from "../Assets/Pear.gif";
import Wearly from "../Assets/Wearly.gif";
import Freshly from "../Assets/Freshly.gif";
import Fire from "../Assets/Fire.gif";
import {VscGithub} from "react-icons/vsc"
import {FiExternalLink} from "react-icons/fi"
export const Work = () => {
  return (
    <div name="work" className="w-full md:h-screen text-gray-300">
      <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full">
        <div className="md: text-center">
          <p
            className="text-4xl font-bold inline border-b-4 border-pink-600 
                    "
          >
            MY PROJECTS
          </p>
          <p className="pt-4 pb-4">//Checkout some of my recent works</p>
        </div>

        <div className="flex flex-col gap-20"></div>
        
      </div>
    </div>
  );
};
