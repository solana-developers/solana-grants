import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { SendTransaction } from "../../components/SendTransaction";

export interface Props {
  id: number;
  name: string;
  author: {
    name: string;
    link: string;
    address: string;
  };
  summary: string;
  description: string;
  amountRaised: number;
  amountGoal: number;
  numContributors: number;
  repo: string;
  website: string;
  bgColor: string;
  image: string;
}

export const GrantView: FC<Props> = (props) => {
  const roundedAmtRaised = Math.round(props.amtRaised);

  return (
    <div className=' max-w-6xl mx-auto p-4'>
      <div className='w-full flex flex-row'>
        <div className='relative pb-1/3 w-2/3'>
          <img
            className='absolute h-full object-cover'
            src={props.image}
            alt='grant background'
          />
        </div>
        <div id='donation' className='bg-thistle'>
          
          <p
            className={
              "font-mono mx-auto text-sm text-right text-opacity-90 "
            }
          >
            <p
              className={
                "text-xl text-left font-semibold color-green "
              }
            >
              ${roundedAmtRaised}
            </p>
            Raised from <strong>{props.numContributors}</strong> supporters
          </p>
          <button className='btn gap-2'>
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
            Button
          </button>

          <p>a</p>
        </div>
      </div>
      <div className='bg-indigo-500 w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow'>
        {/* <!-- fixed-width --> */}

        <div className='w-1/4 flex-shrink flex-grow-0 px-4'>
          <div className='sticky top-0 p-4 w-full h-full'>
            {/* <!-- nav goes here -->  */}
            <h1 className='text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]'>
              Basics
            </h1>
          </div>
        </div>
        <main role='main' className='w-full flex-grow pt-1 px-3'>
          {/* <!-- fluid-width: main content goes here --> */}
          <div className='bg-slate-500 w-auto h-1/2'>
            <p>{props.description}</p>
            <p>{props.description}</p>
          </div>
          <h1 className='text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]'>
            Basics
          </h1>
        </main>
        <div className='w-1/3 flex-shrink flex-grow-0 px-2'>
          {/* <!-- fixed-width --> */}
          <div className='flex sm:flex-col px-2'>
            {/* <!-- sidebar goes here --> */}
            <h1 className='text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]'>
              Basics
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
