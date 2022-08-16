import { FC, useEffect, useState } from "react";
import Markdown from "marked-react";
import { Path } from "progressbar.js";
import CountUp from "react-countup";
import fetchGithubUserDataFromUserId from "utils/fetchGithubUserDataFromUserId";
import Error from "next/error";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { RiCheckboxMultipleBlankLine, RiCheckboxMultipleFill } from "react-icons/ri";
import DonateSol from "../../components/DonateSol";
import { PublicKey } from "@solana/web3.js";

export interface Props {
  // *** = should come from the db
  grantNum: number; // anchor
  grantPDA: PublicKey;
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
  const [preview, setPreview] = useState(false);
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

  const [copied, setCopied] = useState(false);
  
  return (
    <div className='flex flex-row flex-wrap max-w-6xl p-4 mx-auto space-y-10'>
      <div className='w-full gap-4 mx-auto mb-4 prose text-center md:prose-lg'>
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

      <div className='mx-auto sm:px-4 w-sm md:w-1/3'>
        <div className='flex flex-row h-48 gap-4 mx-auto md:h-80 '>
          <svg
            className="md:hidden lg:block stroke-slate-800 stroke-[20px] md:stroke-[12px] h-full w-1/2 pl-4 pb-4"
            viewBox="-10 10 40 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.50006 194C14.5001 181.5 22.9001 145.2 8.50006 100C-5.89994 54.8 2.50006 19.5 8.50006 1" />
            <path
              id="progress-bar"
              d="M8.50006 194C14.5001 181.5 22.9001 145.2 8.50006 100C-5.89994 54.8 2.50006 19.5 8.50006 1"
              stroke="#14F195"
            />
          </svg>
          <div id='stats' className='flex flex-wrap content-between pb-4'>
            <div className='w-full'>
              <p id='amount-raised' className='text-5xl'>
                <CountUp
                  end={roundedAmtRaised}
                  duration={animationDuration}
                  separator=","
                  useEasing={true}
                  onStart={() => handleCounterStart(animationDuration * 1000)}
                />
                {" "}SOL
              </p>
              <p className='text-base'>out of {props.amountGoal} SOL</p>
            </div>
            <div className="w-1/2 md:w-full">
              <h1 className="text-5xl">
                <CountUp
                  end={props.numContributors}
                  duration={animationDuration}
                  separator=","
                  useEasing={true}
                />
              </h1>
              <p className="text-base">supporters</p>
            </div>
            <div className="w-1/2 md:w-full">
              <h1 className="text-5xl">
                <CountUp
                  start={365}
                  end={daysToRelease}
                  duration={animationDuration}
                  separator=","
                  useEasing={true}
                />
              </h1>
              <p className="text-base">days to release</p>
            </div>
          </div>
        </div>
        <a
          href="#donate"
          className="btn btn-success w-full mx-auto gap-2 m-2"
          onClick={() => {
            setPreview(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Donate
        </a>
        {preview && (
          <DonateSol setpreview={setPreview} grantPDA={props.grantPDA} />
        )}
        {!props.allowDonation && <p className="text-sm">{props.reasonForNotAllowingDonation}</p>}
      </div>
      <main role='main' className='flex-grow sm:w-2/3 sm:pt-4 md:px-6'>
        <article className='mx-auto prose-sm prose md:prose-base max-w-none lg:pr-16'>
          <Markdown>{props.description}</Markdown>
        </article>
      </main>
      <div className='flex-grow-0 flex-shrink max-w-sm px-2 mx-auto sm:w-1/3'>
        <div className='flex px-2 pt-4 sm:flex-col'>
          <div className='p-4 px-3 py-4 space-y-4 '>
            <div className='grid items-center grid-cols-6'>
              <img
                className='w-6 h-6 justify-self-center'
                src='/images/github.png'
                alt='www logo'
              />
              <a
                className='col-span-5 text-current link link-secondary link-hover'
                href={"https://" + props.ghRepo}
              >
                {props.ghRepo}
              </a>
            </div>
            <div className='grid items-center grid-cols-6 pb-4 mb-4 border-b border-slate-800'>
              <img
                className='w-6 h-6 justify-self-center'
                src='/images/website.png'
                alt='www logo'
              />
              <a
                className='col-span-5 text-current link link-secondary link-hover'
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
                  <CopyToClipboard
                    className='col-span-3 btn btn-ghost btn-sm'
                    text={props.author.walletAddress}
                    onCopy={() => setCopied(true)}
                  >
                    <div>

                    <span className='w-3/4 lowercase truncate '>
                      {props.author.walletAddress}
                    </span>
                    {copied 
                      ? <RiCheckboxMultipleFill className='w-1/4 text-xl text-emerald-400' />
                      : <RiCheckboxMultipleBlankLine className='w-1/4 text-xl' />
                    }
                    </div>
                  </CopyToClipboard>
                  <a
                    className='col-span-3 truncate group btn btn-secondary btn-sm'
                    href={
                      "https://explorer.solana.com/address/" +
                      props.author.walletAddress
                    }
                  >
                    <span className='text-slate-600'>Support author</span>
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
