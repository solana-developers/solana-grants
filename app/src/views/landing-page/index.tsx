import Link from "next/link";
import { FC, useState } from "react";
import CreateGrant from "../../components/CreateGrant";

export const LandingPageView: FC = ({}) => {
  const [preview, setpreview] = useState(false);
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
            <p className='my-5 mt-8 text-6xl font-bold text-right normal-case'>
              The place to fund in the open
            </p>
            
              <p className='text-lg text-left normal-case '>
                Open source software is awesome for the users, funding it makes it awesome for the maintainers too. The foundations are putting money in the pit, help distributing it by donating to grants.
              </p>
            
            <div className='flex justify-center mt-8'>
              <Link href='/explore'>
                <button className='py-2 mr-4 text-sm text-black bg-green-400 rounded-full hover:bg-emerald-500 px-9'>
                  EXPLORE
                </button>
              </Link>
              <a
                href='#create-grant'
                className='bg-transparent border rounded-full btn hover:bg-slate-500 text-fuchsia-300 border-fuchsia-300'
                onClick={() => {
                  setpreview(true);
                }}
              >
                CREATE A GRANT
              </a>
              {preview && <CreateGrant setpreview={setpreview} />}
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
