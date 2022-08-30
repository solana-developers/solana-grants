import { FC } from 'react';
import { useRouter } from "next/router";
import GrantStats from "../../components/grant_stats";
import {useWallet} from "@solana/wallet-adapter-react";

export const LandingPageView: FC = ({ }) => {
  const router = useRouter();

  const navigateToCreateGrantPage = () => {
    router.push("/create-grant");
  }

  const navigateToExplorePage = () => {
    router.push("/explore");
  }

  const slide = ({ forward }) => {
    const scroller = document.querySelector(".carousel-container");
    const itemWidth = document.querySelector(".slide-content").clientWidth;
    if (forward) {
      scroller.scrollBy({ left: itemWidth, top: 0, behavior: "smooth" });
    } else {
      scroller.scrollBy({ left: -itemWidth, top: 0, behavior: "smooth" });
    }
  };

  return (
      <div>
        <div className='flex justify-center my-24'>
          <div className='flex justify-center hidden md:block w-[400px] h-[350px]'>
            <img src='/images/sol-man.png' />
          </div>
          <div className='flex items-center w-[400px] h-[350px]'>
            <div className='flex flex-col items-center md:items-start m-8 md:m-5'>
              <div className='my-5 mt-8'>
                <b className="normal-case text-4xl">The place to fund in the open</b>
              </div>
              <div>
                <p className="normal-case text-lg text-center md:text-left">Open source software is awesome for the users, funding it makes it awesome for the maintainers too. The foundations are putting money in the pit, help distributing it by donating to grants.</p>
              </div>
              <div className='flex justify-center mt-8'>
                <button className="bg-green-400 hover:bg-emerald-500 py-2 px-9 text-black text-sm rounded-full mr-4" onClick={navigateToExplorePage}>
                  EXPLORE
                </button>
                <button className="bg-transparent hover:bg-slate-500 py-2 px-6 text-fuchsia-300 border border-fuchsia-300 text-sm rounded-full btn"  onClick={navigateToCreateGrantPage}>
                  CREATE A GRANT
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center mt-60 mb-20'>
          <div className='my-2'>
            <img src='/images/grants-stats-icon.svg' />
          </div>
          <div className='my-2'>
            <b className="normal-case text-3xl">Grants Stats</b>
          </div>
          <div className='my-2'>
            <p className="normal-case text-md text-center md:mx-0 mx-5">Cras convallis lacus orci, tristique tincidunt magna consequat in. In vel  est, at euismod libero.</p>
          </div>
          <div className='flex items-center sm:w-[70%] w-[95%]'>
            <button className="bg-purple-700 hover:bg-purple-900 pt-1 pb-2 px-3 rounded-md text-lg" onClick={() => slide({ forward: false })}>❮</button>
            <div className="carousel carousel-container rounded-box my-40 mx-5">
              <div className="carousel-item">
                <div className='slide-content w-64 h-56 m-4'>
                  <img src="/images/man-climbs-blockchain-tree.png" className='h-full' />
                </div>
              </div>
              <GrantStats />
            </div>
            <button className="bg-purple-700 hover:bg-purple-900 pt-1 pb-2 px-3 rounded-md text-lg" onClick={() => slide({ forward: true })}>❯</button>
          </div>
        </div>
      </div>
  );
};