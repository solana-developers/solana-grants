import { FC, useEffect, useState } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import { Path } from "progressbar.js";
import CountUp from 'react-countup';

export interface Props {
  grantNum: number;      // anchor
  title: string;         // ***
  author: {
    name: string;       // ***
    ghAccount: string;  // from the gh authentication, could also be stored on the db
    walletAddress: string;   // ***
  };
  about: string;       // ***
  description: string; // ***
  amountRaised: number;   // anchor
  amountGoal: number;     // anchor
  numContributors: number;// anchor
  targetDate: number;     // anchor
  repo: string;        // ***
  website?: string;    // ***
  bgColor: string;     // ***
  image: string;       // ***
}

export const GrantView: FC<Props> = (props) => {
  const animationDuration = 2.5 // secs
  const roundedAmtRaised = Math.round(props.amountRaised);
 
  const handleCounterStart = (duration: number) => {
    let bar = new Path("#progress-bar", {
      easing: "linear",
      duration,
    });
    bar.set(0);
    bar.animate(props.amountGoal / props.amountRaised);
  } 

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const daysToRelease = Math.round(Math.abs((new Date().getTime() - props.targetDate) / oneDay));

  return (
    <div className=' max-w-6xl mx-auto p-4'>
      <div className='text-center mx-auto gap-4 mb-4'>
        <b className='text-4xl'>{props.title}</b>
        <p className='prose mx-auto text-xl'>{props.about}</p>
      </div>
      <div className='w-full flex flex-row'>
        <div className='relative pb-1/3 w-2/3'>
          <img
            className='absolute h-full object-cover'
            src={props.image}
            alt='grant background'
          />
        </div>

        <div className=' w-1/3'>
          <div className='flex flex-row  h-4/5'>
            <svg
              className='stroke-slate-800 stroke-[10px] h-64 mt-2'
              // width='52'
              // height='100%'
              viewBox='-10 10 50 180'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M8.50006 194C14.5001 181.5 22.9001 145.2 8.50006 100C-5.89994 54.8 2.50006 19.5 8.50006 1' />
              <path
                id='progress-bar'
                d='M8.50006 194C14.5001 181.5 22.9001 145.2 8.50006 100C-5.89994 54.8 2.50006 19.5 8.50006 1'
                stroke='#14F195'
              />
            </svg>
            <div id='stats' className='grid gap-5 ml-4 '>
              <div className=''>
                <p id='amount-raised' className='text-5xl'>
                  $
                  <CountUp
                    end={roundedAmtRaised}
                    duration={animationDuration}
                    separator=','
                    useEasing={true}
                    onStart={() => handleCounterStart(animationDuration * 1000)}
                  />
                </p>
                <p className='text-base'>out of ${props.amountGoal}</p>
              </div>
              <div className=''>
                <h1 className='text-5xl'>
                  <CountUp
                    end={props.numContributors}
                    duration={animationDuration}
                    separator=','
                    useEasing={true}
                  />
                </h1>
                <p className='text-base'>supporters</p>
              </div>
              <div className=''>
                <h1 className='text-5xl'>
                  <CountUp
                    start={365}
                    end={daysToRelease}
                    duration={animationDuration}
                    separator=','
                    useEasing={true}
                  />
                </h1>
                <p className='text-base'>days to release</p>
              </div>
            </div>
          </div>
          <button className='btn btn-success btn-wide gap-2 m-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
              />
            </svg>
            Donate
          </button>
        </div>
      </div>
      <div className=' w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow'>
        {/* <!-- fixed-width --> */}

        <main role='main' className='w-full flex-grow pt-1 px-3'>
          {/* <!-- fluid-width: main content goes here --> */}
          <div className='prose mx-auto w-auto h-1/2'>
            <p>{props.description}</p>
            <p>{props.description}</p>
          </div>
        </main>
        <div className='w-1/3 flex-shrink flex-grow-0 px-2'>
          {/* <!-- fixed-width --> */}
          <div className='flex sm:flex-col px-2'>
            {/* <!-- sidebar goes here --> */}
          </div>
        </div>
      </div>
    </div>
  );
};
