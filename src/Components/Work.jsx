import React from "react";
import Pear from "../Assets/Pear.gif";
import Wearly from "../Assets/Wearly.gif";
import Freshly from "../Assets/Freshly.gif";
import Fire from "../Assets/Fire.gif";
import {VscGithub} from 'react-icons/vsc';
import {FiExternalLink} from 'react-icons/fi';
export const Work = () => {
  return (
    <div name="work"
      className="w-screen text-white md:h-auto "
    >
      <div className=" max-w-[1000px] p-4 mx-auto flex flex-col justify-center w-full h-full">
        <div className="md: text-center">
          <p className="text-4xl font-bold inline border-b-4 border-pink-600">
            MY PROJECTS 
          </p>
          <p className="py-6">//Checkout some of my recent works</p>
        </div>
        {/* grid sm:grid-cols-2 md:grid-cols-3 gap-8 shadow-md shadow-gray-500  */}
        <div className="flex flex-col gap-20">
          {/* ====================================================== */}
          <div className=" flex max-[850px]:flex-col w-full ">
          <div className=" w-2/5 max-[850px]:w-[85%] px-5 text-white max-[850px]:my-8 ">
              <h1 className="text-3xl font-bold text-white pb-2">
                Wearly Website
                <hr />
              </h1>
              <p> Wearly plc is a British online fashion and cosmetic retailer.
                  The company was founded in 2000 in London, primarily aimed at
                  young adult</p>
              <h1 className="text-2xl font-bold text-white py-2">
                Tech Stack :
              </h1>
              <p>
                React || Redux || Axios || React-Router-Dom || Stripe ||
                Chakra-UI || Node || Express || MongoDB || Cyclic || Vercel
              </p>
              <h1 className="text-2xl font-bold text-white py-2">
                Features :
              </h1>
              <p>
                Login/Signup || Stripe Payment  || Admin Section || Cart
                || Checkout Order || Product Page with Filter || Own Backend
              </p>
              <h1 className="text-2xl font-bold py-2 animate-none md:animate-pulse z-0">
                Area of responsibility :
              </h1>
              <p className=" text-pink-500 font-bold" >
                 Backend for login, signup and products with search filter and sorting 
              </p>
              <p className=" font-bold">
                A collaborative project built by a team of 5 Full stack web
                developers executed in 5 days.
              </p>

              <div className="flex gap-10 max-[500px]:flex-col max-[500px]:gap-1">
                <a
                  href="https://github.com/abhishek1337chatterjee/Wearly-Website"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" group duration-200 hover:scale-105 text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-[#0e0c49]  to-[#0e0a7a] cursor-pointer gap-3 ">
                    GitHub <VscGithub size={"25px"} />
                  </button>
                </a>
                <a
                  href="https://wearly.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" group duration-200 hover:scale-105 text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-[#0e0c49]  to-[#0e0a7a] cursor-pointer gap-3">
                    Deployed <FiExternalLink size={"22px"}/>
                  </button>
                </a>
              </div>
            </div>
            <div className=" w-3/5 max-[850px]:w-[95%] h-auto mt-10  " >
              <img
                src={Wearly}
                alt="Trendy_Mart"
                width={"100%"}
                height="100vh"
                
              />
            </div>
            
          </div>

          {/* ================================================================================ */}
          <div className=" flex max-[850px]:flex-col w-full">
            <div className=" w-3/5 max-[850px]:w-[95%] h-auto mt-12" 
            data-aos="fade-right" data-aos-duration="2500" >
              <img
                src={Pear}
                alt="pear"
                width={"100%"}
                height="100vh"
                
              />
            </div>
            <div className=" w-2/5 max-[850px]:w-[85%] px-5 text-white max-[850px]:my-8">
              <h1 className="text-3xl font-bold text-white pb-2">
                Pear Website
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
              <p className="text-pink-500 font-bold">
                Login and SignUp Page using Firebase || Protecting the Routes || Showing the user after login in the homepage
              </p>
              <p className=" font-bold">
                A collaborative project built by a team of 5 Full stack web
                developers executed in 5 days.
              </p>

              <div className="flex gap-10 max-[500px]:flex-col max-[500px]:gap-1">
                <a
                  href="https://github.com/abhishek1337chatterjee/Pear-website"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" group duration-200 hover:scale-105 text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-[#0e0c49]  to-[#0e0a7a] cursor-pointer gap-3 ">
                    GitHub <VscGithub size={"25px"} />
                  </button>
                </a>
                <a
                  href="https://pear-website.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" group duration-200 hover:scale-105 text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-[#0e0c49]  to-[#0e0a7a] cursor-pointer gap-3">
                    Deployed <FiExternalLink size={"22px"}/>
                  </button>
                </a>
              </div>
            </div>
          </div>
          {/* =================================================== */}
          <div className=" flex max-[850px]:flex-col-reverse w-full">
            <div className=" w-2/5 max-[850px]:w-[85%] px-5 text-white max-[850px]:my-8">
              <h1 className="text-3xl font-bold text-white pb-2">
                Freshly Website
                <hr />
              </h1>
              <p>
              Freshly delivers gourmet ready-made meals, prepared and
                  delivered at the door. It is dedicated to making healthy
                  eating and achieving health and fitness goals easier than
                  ever.
              </p>
              <h1 className="text-2xl font-bold text-white py-2">
                Tech Stack :
              </h1>
              <p>
                HTML || CSS || JavaScript 
               
              </p>
              
              <h1 className="text-2xl font-bold text-white py-2">
                Features :
              </h1>
              <p>
                Login/Signup using local storage || Filtering Sorting || Adding items to chart
              </p>
              <h1 className="text-2xl font-bold py-2 animate-none md:animate-pulse z-0">
                Area of responsibility :
              </h1>
              <p className=" text-pink-500 font-bold" >
                 The complete landing page || After login user details shown in landing page
              </p>
              <p className=" font-bold">
              A collaborative project built by a team of 5 Full stack web
                developers executed in 5 days.
              </p>

              <div className="flex gap-10 max-[500px]:flex-col max-[500px]:gap-1">
                <a
                  href="https://github.com/abhishek1337chatterjee/freshly.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" group duration-200 hover:scale-105 text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-[#0e0c49]  to-[#0e0a7a]  cursor-pointer gap-3 ">
                    GitHub <VscGithub size={"25px"}/>
                  </button>
                </a>
                <a
                  href="https://fluffy-croquembouche-14d5f2.netlify.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" group duration-200 hover:scale-105 text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-[#0e0c49]  to-[#0e0a7a]  cursor-pointer gap-3">
                    Deployed <FiExternalLink size={"22px"}/>
                  </button>
                </a>
              </div>
            </div>
            <div className=" w-3/5 max-[850px]:w-[95%] h-auto mt-10" 
            data-aos="fade-up" data-aos-duration="2500" >
              <img
                src={Freshly}
                alt="pear"
                width={"100%"}
                height="100vh"
                
              />
            </div>
          </div>
              {/* =============================================================== */}
              <div className=" flex max-[850px]:flex-col w-full mb-10">
            <div className=" w-3/5 max-[850px]:w-[95%] h-auto mt-1" 
            data-aos="fade-right" data-aos-duration="2500" >
              <img
                src={Fire}
                alt="I@J"
                width={"100%"}
                height="100vh"
                
              />
            </div>
            <div className=" w-2/5 max-[850px]:w-[85%] px-5 text-white max-[850px]:my-8"
            data-aos="fade-up" data-aos-duration="2500" >
              <h1 className="text-3xl font-bold text-white pb-2">
              Fire Website
                <hr />
              </h1>
              <p>The fire calculator is a calculator that will return the
                  yearly expenses (as of Today) , year expenses (as of
                  Retirement) and the fire number is the amount that you need to
                  become financially independent.</p>
              <h1 className="text-2xl font-bold text-white py-2">
                Tech Stack :
              </h1>
              <p>
                React || React-Reducer || CSS
              </p>
              

              <div className="flex gap-10 max-[500px]:flex-col max-[500px]:gap-1">
                <a
                  href="https://github.com/abhishek1337chatterjee/Fire-Calculator"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" group duration-200 hover:scale-105 text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-[#0e0c49]  to-[#0e0a7a]  cursor-pointer gap-3 ">
                    GitHub <VscGithub size={"25px"}/>
                  </button>
                </a>
                <a
                  href="https://fire-calculator-zeta.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className=" group duration-200 hover:scale-105 text-white w-fit px-6 py-3 my-2 flex items-center rounded-md bg-gradient-to-r from-[#0e0c49]  to-[#0e0a7a]  cursor-pointer gap-3">
                    Deployed <FiExternalLink size={"22px"}/>
                  </button>
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
