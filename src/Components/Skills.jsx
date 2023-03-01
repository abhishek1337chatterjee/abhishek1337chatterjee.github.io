import React from "react";
import express from "../Assets/express.png"
import cypress from "../Assets/cypress.png"
export const Skills = () => {
  return (
    <div name="skills" className=" text-gray-300">
      <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full">
      <div className="sm: text-center pb-8 pl-4">
            <p
              className="text-4xl font-bold inline border-b-4 border-pink-600
                    "
            >
              MY SKILLS
            </p>
          </div>
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-center py-8">
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://chiranjeev-thapliyal.vercel.app/svg/html-5.svg" alt="HTML icon" />
                <p className=" my-4 "> HTML</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://chiranjeev-thapliyal.vercel.app/svg/css3.svg" alt="HTML icon" />
                <p className=" my-4 "> CSS </p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://chiranjeev-thapliyal.vercel.app/svg/javascript.svg" alt="HTML icon" />
                <p className=" my-4 "> JavaScript </p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://velvety-croquembouche-9aebc1.netlify.app/static/media/typescript.f66836b8.svg" alt="HTML icon" />
                <p className=" my-4 "> TypeScript</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://chiranjeev-thapliyal.vercel.app/svg/reactjs.svg" alt="HTML icon" />
                <p className=" my-4 "> React.js</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://www.datocms-assets.com/75941/1657707878-nextjs_logo.png" alt="HTML icon" />
                <p className=" my-4 "> Next.js </p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://chiranjeev-thapliyal.vercel.app/svg/redux.svg" alt="HTML icon" />
                <p className=" my-4 ">Redux.js</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://chiranjeev-thapliyal.vercel.app/svg/nodejs.svg" alt="HTML icon" />
                <p className=" my-4 ">Node.js</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://chiranjeev-thapliyal.vercel.app/svg/mongodb.svg" alt="HTML icon" />
                <p className=" my-4 "> MongoDB</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src={express} alt="HTML icon" />
                <p className=" my-4 "> Express </p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://www.loopple.com/img/tailwind-logo.png" alt="HTML icon" />
                <p className=" my-4 "> Tailwind CSS</p>
            </div>
          </div>
      </div>

      <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full">
      <div className="sm: text-center pb-8 pl-4">
            <p
              className="text-4xl font-bold inline border-b-4 border-pink-600
                    "
            >
              Tools
            </p>
          </div>
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-center py-8">
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://chiranjeev-thapliyal.vercel.app/svg/git.svg" alt="HTML icon" />
                <p className=" my-4 "> Git</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="HTML icon" />
                <p className=" my-4 "> Github</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://cdn.iconscout.com/icon/free/png-256/npm-3521612-2945056.png" alt="HTML icon" />
                <p className=" my-4 "> NPM</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src={cypress} alt="HTML icon" />
                <p className=" my-4 "> Cypress</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://www.datocms-assets.com/35255/1665957463-sponsor-logo-vercel.png" alt="HTML icon" />
                <p className=" my-4 "> Vercel</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Swagger-logo.png" alt="HTML icon" />
                <p className=" my-4 "> Swagger</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://avatars.githubusercontent.com/u/77067997?s=200&v=4" alt="HTML icon" />
                <p className=" my-4 "> Cyclic.sh</p>
            </div>
            <div className="shadow-md pt-4 shadow-[#040c16] px hover:scale-110 duration-500">
                <img className="w-20 mx-auto" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png" alt="HTML icon" />
                <p className=" my-4 ">VS Code</p>
            </div>
          </div>
      </div>
    </div>
  );
};
