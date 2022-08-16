import { contrastColor } from "contrast-color";
import { BN } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/router";

export interface ExplorerCardProps {
  imageLink: string;
  title: string;
  author: BN | string;
  authorLink: string;
  description: string;
  githubProjectLink: string;
  numDonors: number;
  fundingState: {
    cancelled?: Object
    resolved?: Object
    active?: Object
  };
  dueDate: BN | number;
  matchingEligible: boolean;
  isCancelled: boolean;
  lamportsRaised: BN | number;
  targetLamports: BN | number;
  idx: number;
}

/**
 * A card to show a description of a project in the explorer view.
 * @param bgColor is expected to be taken from the image, ideally provided by the backend
 */
export const ExplorerCard = ({
  imageLink,
  title,
  author,
  authorLink,
  description,
  githubProjectLink,
  numDonors,
  lamportsRaised,
  idx
}: ExplorerCardProps) => {
  const roundedAmtRaised = Math.round(lamportsRaised as number / LAMPORTS_PER_SOL);
  const textColor = contrastColor({ bgColor: "yellow", fgLightColor: "text-slate-200", fgDarkColor: "text-slate-800", });
  const router = useRouter();

  const goToGrantDetailView = () => {
    router.push(`/grant/${idx}`);
  }

  return (
    <>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <a href={githubProjectLink}>
          <figure className='relative'>
            <div className='absolute flex w-full h-full transition-opacity opacity-0 bg-slate-700 hover:opacity-90'>
              <button className='m-auto btn btn-secondary' onClick={goToGrantDetailView}>Learn More</button>
            </div>
            <img className='w-full' src={imageLink} alt='Project image' />
          </figure>
        </a>
        <div
          className={"card-body " + textColor}
          style={{ background: "yellow" }}
        >
          <a href={githubProjectLink}>
            <h2 id='title' className='card-title mb-1 font-mono'>
              {title}
            </h2>
          </a>
          <p id='author' className='mb-3 font-mono text-xs flex'>
            By{" "}
            {author ? (
              <a className='underline underline-offset-4 ml-2' href={authorLink}>
                {author}
              </a>
            ) : (
              <div className='w-3 h-3 rounded-full animate-spin loading-spinner-gradients ml-2'></div>
            )}
          </p>
          <p id='description' className={'line-clamp-3 text-opacity-90 ' + textColor}>
            {description}
          </p>
          <div className='card-actions'>
            <p className={'font-mono mx-auto text-sm text-right text-opacity-90 '+textColor}>
              <p className={'text-xl text-left font-semibold color-green '+textColor}>${roundedAmtRaised}</p>
              Raised from <strong>{numDonors}</strong> supporters
            </p>
            <button className='m-auto btn btn-primary'>Donate</button>
          </div>
        </div>
      </div>
    </>
  );
};
