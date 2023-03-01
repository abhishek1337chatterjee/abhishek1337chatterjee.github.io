import React from "react";
import Pear from "../Assets/Pear.png";
import Wearly from "../Assets/Wearly.png";
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

        <div className="grid  md:grid-cols-2 gap-4">
          <div
            style={{ backgroundImage: `url(${Pear})` }}
            className="shadow-lg shadow-[#040c16] group container rounded-md flex justify-center px-4 mx-auto content-div"
          >
            {/* Hover Effects */}
            <div className="opacity-0 group-hover:opacity-100">
              <span>
                <p className="text-2xl font-bold pb-2 text-white tracking-wider">
                  Pear Website
                </p>
                <p className="sm: text-[13.5px] md:text-sm lg:text-lg text-gray-400 pt-2">
                  Pear is built with the reference website "apple.com". It is an
                  ecommerce website for electronic products with an eye-catching
                  UI where the users can buy various electronic items, with
                  customizable design selections.
                </p>

                <div className="flex flex-row sm:mt-1 md:mt-2">
                  <p className="md:text-xl text-orange-400">Teck Stack:-</p>
                  <p className="md:text-lg text-black-500 ml-3">
                    React.js | Firebase | Redux | Chakra UI
                  </p>
                </div>
              </span>
              <div className=" pt-2 text-center">
                <a href="/">
                  <button className="text-center rounded-lg px-2 py-1 m-2 bg-white text-gray-700 font-bold text-lg">
                    Demo
                  </button>
                </a>
                <a href="/">
                  <button className="text-center rounded-lg px-2 py-1 m-2 bg-white text-gray-700 font-bold text-lg">
                    Code
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div
            style={{ backgroundImage: `url(${Wearly})` }}
            className="shadow-lg shadow-[#040c16] group container rounded-md flex justify-center px-4 mx-auto content-div"
          >
            {/* Hover Effects */}
            <div className="opacity-0 group-hover:opacity-100">
              <span>
                <p className="text-2xl font-bold pb-2 text-white tracking-wider">
                  Wearly Website
                </p>
                <p className="sm: text-[15.5px] md:text-lg lg:text-lg text-gray-400 pt-2">
                  Wearly plc is a British online fashion and cosmetic retailer.
                  The company was founded in 2000 in London, primarily aimed at
                  young adults
                </p>

                <div className="flex flex-row sm:mt-1 md:mt-2">
                  <p className="md:text-xl text-orange-400">Teck Stack:-</p>
                  <p className="md:text-lg text-black-500 ml-3">
                    React.js | Node.js | Express.js | MongoDB
                  </p>
                </div>
              </span>
              <div className=" pt-2 text-center">
                <a href="/">
                  <button className="text-center rounded-lg px-2 py-1 m-2 bg-white text-gray-700 font-bold text-lg">
                    Demo
                  </button>
                </a>
                <a href="/">
                  <button className="text-center rounded-lg px-2 py-1 m-2 bg-white text-gray-700 font-bold text-lg">
                    Code
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div
            style={{ backgroundImage: `url(${Pear})` }}
            className="shadow-lg shadow-[#040c16] group container rounded-md flex justify-center px-4 mx-auto content-div"
          >
            {/* Hover Effects */}
            <div className="opacity-0 group-hover:opacity-100">
              <span>
                <p className="text-2xl font-bold pb-2 text-white tracking-wider">
                  Pear Website
                </p>
                <p className="sm: text-[13.5px] md:text-sm lg:text-lg text-gray-400 pt-2">
                  Pear is built with the reference website "apple.com". It is an
                  ecommerce website for electronic products with an eye-catching
                  UI where the users can buy various electronic items, with
                  customizable design selections.
                </p>

                <div className="flex flex-row sm:mt-1 md:mt-2">
                  <p className="md:text-xl text-orange-400">Teck Stack:-</p>
                  <p className="md:text-lg text-black-500 ml-3">
                    React.js | Firebase | Redux | Chakra UI
                  </p>
                </div>
              </span>
              <div className=" pt-2 text-center">
                <a href="/">
                  <button className="text-center rounded-lg px-2 py-1 m-2 bg-white text-gray-700 font-bold text-lg">
                    Demo
                  </button>
                </a>
                <a href="/">
                  <button className="text-center rounded-lg px-2 py-1 m-2 bg-white text-gray-700 font-bold text-lg">
                    Code
                  </button>
                </a>
              </div>
            </div>
          </div>

          <div
            style={{ backgroundImage: `url(${Wearly})` }}
            className="shadow-lg shadow-[#040c16] group container rounded-md flex justify-center px-4 mx-auto content-div"
          >
            {/* Hover Effects */}
            <div className="opacity-0 group-hover:opacity-100">
              <span>
                <p className="text-2xl font-bold pb-2 text-white tracking-wider">
                  Wearly Website
                </p>
                <p className="sm: text-[13.5px] md:text-sm lg:text-lg text-gray-400 pt-2">
                  Wearly plc is a British online fashion and cosmetic retailer.
                  The company was founded in 2000 in London, primarily aimed at
                  young adults.
                </p>

                <div className="flex flex-row sm:mt-1 md:mt-2">
                  <p className="md:text-xl text-orange-400">Teck Stack:-</p>
                  <p className="md:text-lg text-black-500 ml-3">
                    React.js | Node.js | Express.js | MongoDB
                  </p>
                </div>
              </span>
              <div className=" pt-2 text-center">
                <a href="/">
                  <button className="text-center rounded-lg px-2 py-1 m-2 bg-white text-gray-700 font-bold text-lg">
                    Demo
                  </button>
                </a>
                <a href="/">
                  <button className="text-center rounded-lg px-2 py-1 m-2 bg-white text-gray-700 font-bold text-lg">
                    Code
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
