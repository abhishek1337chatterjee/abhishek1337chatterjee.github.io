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

        <div className="flex flex-col gap-20">
          <div className=" max-[850px]:flex-col w-full">
            <div className=" w-2/5 max-[850px]:w-[85%] px-5 text-white max-[850px]:my-8">
            <h1 className="text-3xl font-bold text-white pb-2">
                Pear.com
                <hr />
              </h1>
              <p>Pear is built with the reference website apple.com.</p>
              <h1 className="text-2xl font-bold text-white py-2">
                Tech Stack :
              </h1>
              <p>
                React || Redux || Axios || React-Router-Dom || FireBase-Auth ||
                Chakra-UI || Vitejs
              </p>
              <h1 className="text-2xl font-bold text-white py-2">
                Features :
              </h1>
              <p>
                Login/Signup || Google Authentication || Admin Section || Cart
                || Place Order
              </p>
              <h1 className="text-2xl font-bold text-white py-2 animate-none md:animate-pulse z-0">
                Area of responsibility :
              </h1>
              <p className="text-blue-500 font-bold">
                Mac and Watch Page || Single Product Page || Cart Page ||
                Checkout Page
              </p>
              <p className=" font-bold">
                A collaborative project built by a team of 5 Full stack web
                developers executed in 5 days.
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
