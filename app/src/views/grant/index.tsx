import { FC, useEffect, useState } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";
import Markdown from "marked-react";
import { Path } from "progressbar.js";
import CountUp from "react-countup";

export interface Props {
  // *** = should come from the db
  grantNum: number; // anchor
  title: string; // ***
  author: {
    name: string; // anchor or ***
    ghAccount: string; // from the gh authentication, could also be stored on the db
    ghAvatar: string; // from gh auth, can also be stored on db
    walletAddress: string; // anchor
  };
  about: string; // ***
  description: string; // ***
  amountRaised: number; // anchor
  amountGoal: number; // anchor
  numContributors: number; // anchor
  targetDate: number; // anchor
  repo: string; // anchor
  website?: string; // ***
  bgColor: string; // ***
  image: string; // ***
}

export const GrantView: FC<Props> = (props) => {
  const animationDuration = 3; // secs
  const roundedAmtRaised = Math.round(props.amountRaised);

  const handleCounterStart = (duration: number) => {
    let bar = new Path("#progress-bar", {
      easing: "linear",
      duration,
    });
    bar.set(0);
    const percentage = props.amountRaised / props.amountGoal;
    bar.animate(percentage);
  };

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const daysToRelease = Math.round(
    Math.abs((new Date().getTime() - props.targetDate) / oneDay)
  );

  return (
    <div className='flex flex-row flex-wrap space-y-10 max-w-6xl mx-auto p-4'>
      <div className='prose md:prose-lg w-full text-center mx-auto gap-4 mb-4'>
        <h1 className=''>{props.title}</h1>
        <p className='mx-auto md:text-xl'>{props.about}</p>
      </div>
      <div className='relative pb-2/3 w-full md:pb-1/3 md:w-2/3'>
        <img
          className='absolute h-full object-cover'
          src={props.image}
          alt='grant background'
        />
      </div>

      <div className=' sm:px-4 w-sm md:w-1/3 mx-auto '>
        <div className='flex flex-row h-48 mx-auto gap-4 md:h-80 '>
          <svg
            className='md:hidden lg:block stroke-slate-800 stroke-[20px] md:stroke-[12px] h-full w-1/2 pl-4 pb-4'
            viewBox='-10 10 40 180'
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
          <div id='stats' className='flex flex-wrap content-between pb-4'>
            <div className='w-full'>
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
            <div className='w-1/2 md:w-full'>
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
            <div className='w-1/2 md:w-full'>
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
        <button className='btn btn-success btn-wide mx-auto w-full gap-2 m-2'>
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
        {/* </div> */}
      </div>
      <main role='main' className='sm:w-2/3 flex-grow pt-4 md:px-6'>
        <article className='prose prose-sm md:prose-base max-w-none mx-auto'>
          <Markdown>{props.description}</Markdown>
        </article>
      </main>
      <div className='max-w-sm mx-auto sm:w-1/3 flex-shrink flex-grow-0 px-2'>
        <div className='flex sm:flex-col pt-4 px-2'>
          <div className=' py-4 px-3 space-y-3 p-4'>
            <div className='grid grid-cols-6 items-center py-4 mb-4 border-b border-slate-800'>
              <img
                className='justify-self-center w-6 h-6'
                src='/images/website.png'
                alt='www logo'
              />
              <a
                className='link link-primary text-current col-span-5'
                href={props.website}
              >
                {props.website}
              </a>
            </div>
            <p className='text-sm text-slate-400'>Created by:</p>
            <ul className='space-y-3'>
              <li className='grid  grid-cols-6 items-center gap-3'>
                <img
                  className='rounded-full '
                  src={props.author.ghAvatar}
                  alt='github avatar'
                />
                <a
                  className='link link-hover col-span-5 '
                  href={props.author.ghAccount}
                >
                  {props.author.name}
                </a>
              </li>

              <li className='grid grid-cols-6 items-center gap-3'>
                <img
                  className='rounded-full justify-self-center w-6 h-6'
                  src='/images/website.png'
                  alt='www logo'
                />
                <a
                  className='link link-hover text-solana-purple col-span-5 truncate'
                  href={
                    "https://explorer.solana.com/address/" +
                    props.author.walletAddress
                  }
                >
                  {props.author.walletAddress}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
