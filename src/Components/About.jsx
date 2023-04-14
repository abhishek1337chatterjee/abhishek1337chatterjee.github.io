import React from "react";

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
          <p className=" text-justify text-xl lg:text-4xl">
            I am a highly determined, passionate and an enthusiastic Full Stack
            Developer. I focus on writing clean, elegant and efficient codes. I
            love combining the worlds of logic , accessible, and user-friendly
            websites and applications. Apart from coding, I love watching and
            playing cricket and also love to assemble PCs. I am eagerly
            looking forward to kickstart my career and continue refining my
            skills with the right organization.
          </p>
        </div>
      </div>
    </div>
  );
};
