import { FC, useEffect, useState } from "react";
import Markdown from "marked-react";
import { Path } from "progressbar.js";
import CountUp from "react-countup";
import fetchGithubUserDataFromUserId from "utils/fetchGithubUserDataFromUserId";
import Error from "next/error";

export interface Props {
  // *** = should come from the db
  grantNum: number; // anchor
  title: string; // ***
  author: {
    name: string; // from ghApi
    ghUser: string; // from ghApi
    ghAvatar: string; // from gh api
    walletAddress: string; // anchor
  };
  about: string; // ***
  description: string; // ***
  amountRaised: number; // anchor
  amountGoal: number; // anchor
  numContributors: number; // anchor
  targetDate: number; // anchor
  ghRepo: string; // anchor
  ghUserId: string; // anchor
  website?: string; // ***
  image: string; // ***
  allowDonation: boolean;
  reasonForNotAllowingDonation: string;
  err?: boolean;
  message?: string;
}

export const GrantView: FC<Props> = (props) => {
  const animationDuration = 3; // secs
  const roundedAmtRaised = Math.round(props.amountRaised);
  const [loadingCreatorDetailsFromGithub, setLoadingCreatorDetailsFromGithub] = useState(true);

  const handleCounterStart = (duration: number) => {
    let bar = new Path("#progress-bar", {
      easing: "linear",
      duration,
    });
    bar.set(0);
    const percentage = props.amountRaised / props.amountGoal;
    bar.animate(percentage);
  };
  // console.log(props);

  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const daysToRelease = Math.round(
    Math.abs((new Date().getTime() - props.targetDate) / oneDay)
  );

  const fetchCreatorDetailsFromGithubApi = async () => {
    const githubUserDataResponse = await fetchGithubUserDataFromUserId(props.ghUserId);
    if (!githubUserDataResponse.err) {
      props.author.name = githubUserDataResponse.data.name;
      props.author.ghUser = githubUserDataResponse.data.login;
      props.author.ghAvatar = githubUserDataResponse.data.avatar_url; 
    }
    setLoadingCreatorDetailsFromGithub(false);
  }

  useEffect(() => {
    fetchCreatorDetailsFromGithubApi()
  }, []);

  if (props.err) {
    return <Error statusCode={props.message === "Not Found" ? 404 : 500} title={props.message} />
  }

  return (
    <div className='flex flex-row flex-wrap space-y-10 max-w-6xl mx-auto p-4'>
      <div className='prose md:prose-lg w-full text-center mx-auto gap-4 mb-4'>
        <h1 className=''>{props.title}</h1>
        <p className='mx-auto md:text-xl'>{props.about}</p>
      </div>
      <div className='relative pb-2/3 w-full md:pb-1/3 md:w-2/3'>
        <object className='absolute h-full object-cover' data={props.image} type="image/png">
          <img
            className='h-full object-cover'
            src={"/images/default-grant-image.png"}
            alt='grant background'
          />
        </object>
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
                <CountUp
                  end={roundedAmtRaised}
                  duration={animationDuration}
                  separator=','
                  useEasing={true}
                  onStart={() => handleCounterStart(animationDuration * 1000)}
                />
                {" "}SOL
              </p>
              <p className='text-base'>out of {props.amountGoal} SOL</p>
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
        <button className='btn btn-success w-full mx-auto gap-2 m-2' disabled={!props.allowDonation}>
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
        {!props.allowDonation && <p className="text-sm">{props.reasonForNotAllowingDonation}</p>}
      </div>
      <main role='main' className='sm:w-2/3 flex-grow sm:pt-4 md:px-6'>
        <article className='prose prose-sm md:prose-base max-w-none lg:pr-16 mx-auto'>
          <Markdown>{props.description}</Markdown>
        </article>
      </main>
      <div className='max-w-sm mx-auto sm:w-1/3 flex-shrink flex-grow-0 px-2'>
        <div className='flex sm:flex-col pt-4 px-2'>
          <div className=' py-4 px-3 space-y-4 p-4'>
            <div className='grid grid-cols-6 items-center'>
              <img
                className='justify-self-center w-6 h-6'
                src='/images/github.png'
                alt='www logo'
              />
              <a
                className='link link-secondary link-hover text-current col-span-5'
                href={"https://" + props.ghRepo}
              >
                {props.ghRepo}
              </a>
            </div>
            <div className='grid grid-cols-6 items-center pb-4 mb-4 border-b border-slate-800'>
              <img
                className='justify-self-center w-6 h-6'
                src='/images/website.png'
                alt='www logo'
              />
              <a
                className='link link-secondary link-hover text-current col-span-5'
                href={"https://" + props.website}
              >
                {props.website}
              </a>
            </div>
            <p className='text-sm text-slate-400'>Created by:</p>
            {loadingCreatorDetailsFromGithub ? (
              <div className='w-7 h-7 rounded-full animate-spin loading-spinner-gradients'></div>
            ) : (
              <ul className='space-y-3'>
                <li className='grid  grid-cols-6 items-center gap-3'>
                  {props.author.name ? (
                    <>
                      <img
                        className='rounded-full '
                        src={props.author.ghAvatar}
                        alt='github avatar'
                      />
                      <a
                        className='link link-secondary link-hover col-span-5 '
                        href={"https://github.com/" + props.author.ghUser}
                      >
                        {props.author.name}
                      </a>
                    </>
                  ) : (
                    <p>Could not load author details</p>
                  )}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
