import React from 'react'
import GithubCalendar from 'react-github-calendar'
export const Github = () => {
  return (
    <div name="github" className="w-full md:h-screen text-gray-300">
        <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full">
        <div className="md: text-center">
          <p
            className="text-4xl font-bold inline border-b-4 border-pink-600 
                    "
          >
            GITHUB STATISTICS
          </p>
        </div>
        <div className='mt-10 hover:scale-110 duration-500'> 
        <GithubCalendar
            username="abhishek1337chatterjee"
            blockSize={20}
            fontSize={15}
            blockRadius={2}
          >
          </GithubCalendar>
        </div>
        <div className='flex flex-col gap-4 m-auto mt-4 md:flex-row '>
            <div className='hover:scale-110 duration-500'>
                <img src="https://streak-stats.demolab.com/?user=abhishek1337chatterjee&theme=radical" alt="" />
            </div>
            <div className='hover:scale-110 duration-500'>
                <img src="https://github-readme-stats-sigma-five.vercel.app/api?username=abhishek1337chatterjee&show_icons=true&theme=radical" alt="" />
            </div>
        </div>
        <div className='m-auto mt-4 hover:scale-110 duration-500'>
                <img src="https://github-readme-stats-sigma-five.vercel.app/api/top-langs/?username=abhishek1337chatterjee&theme=radical&layout=compact" alt="" />
            </div>
        </div>
    </div>
  )
}
