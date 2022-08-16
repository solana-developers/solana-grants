import { FC ,useState } from 'react';
import { useRouter } from "next/router";

export const LandingPageView: FC = ({ }) => {
  const router = useRouter();

  const navigateToCreateGrantPage = () => {
    router.push("/create-grant");
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
          <img src='/images/bitcoin-man.png' />
        </div>
        <div className='flex items-center w-[400px] h-[350px]'>
          <div className='flex flex-col items-center m-8 md:items-start md:m-5'>
            <div className='my-5 mt-8'>
              <b className='text-4xl normal-case'>Grants Copy</b>
            </div>
            <div>
              <p className='text-lg text-center normal-case md:text-left'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className='flex justify-center mt-8'>
              <button className="bg-green-400 hover:bg-emerald-500 py-2 px-9 text-black text-sm rounded-full mr-4">
                EXPLORE
              </button>
              <button className="bg-transparent hover:bg-slate-500 py-2 px-6 text-fuchsia-300 border border-fuchsia-300 text-sm rounded-full btn"  onClick={navigateToCreateGrantPage}>
                CREATE A GRANT
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center mb-20 mt-60'>
        <div className='my-2'>
          <img src='/images/grants-stats-icon.svg' />
        </div>
        <div className='my-2'>
          <b className='text-3xl normal-case'>Grants Stats</b>
        </div>
        <div className='my-2'>
          <p className='mx-5 text-center normal-case text-md md:mx-0'>
            Cras convallis lacus orci, tristique tincidunt magna consequat in.
            In vel est, at euismod libero.
          </p>
        </div>
        <div className='flex items-center sm:w-[70%] w-[95%]'>
          <button
            className='px-3 pt-1 pb-2 text-lg bg-purple-700 rounded-md hover:bg-purple-900'
            onClick={() => slide({ forward: false })}
          >
            ❮
          </button>
          <div className='mx-5 my-40 carousel carousel-container rounded-box'>
            <div className='carousel-item'>
              <div className='w-64 h-56 m-4 slide-content'>
                <img
                  src='/images/man-climbs-blockchain-tree.png'
                  className='h-full'
                />
              </div>
            </div>
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className='carousel-item'>
                  <div className='flex items-center justify-center h-56 m-4 slide-content w-52 bg-cyan-300 rounded-xl'>
                    <b className='mx-5 text-2xl text-center text-black normal-case'>
                      Placeholder Info {idx + 1}
                    </b>
                  </div>
                </div>
              ))}
          </div>
          <button
            className='px-3 pt-1 pb-2 text-lg bg-purple-700 rounded-md hover:bg-purple-900'
            onClick={() => slide({ forward: true })}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};
