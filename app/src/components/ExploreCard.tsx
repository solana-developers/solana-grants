import { contrastColor } from "contrast-color";
import { BN } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface ExplorerCardProps {
  imageLink: string;
  title: string;
  author: BN | string;
  authorLink: string;
  description: string;
  githubProjectLink: string;
  numDonors: number;
  dueDate: BN | number;
  matchingEligible: boolean;
  isCancelled: boolean;
  lamportsRaised: BN | number;
  targetLamports: BN | number;
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
  lamportsRaised
}: ExplorerCardProps) => {
  const roundedAmtRaised = Math.round(lamportsRaised as number / LAMPORTS_PER_SOL);
  const textColor = contrastColor({ bgColor: "yellow", fgLightColor: "text-slate-200", fgDarkColor: "text-slate-800", });
  return (
    <>
      <div className='card w-96 bg-base-100 shadow-xl z-[-1]'>
        <a href={githubProjectLink}>
          <figure className='relative'>
            <div className='absolute flex w-full h-full transition-opacity opacity-0 bg-slate-700 hover:opacity-90'>
              <button className='m-auto btn btn-secondary'>Learn More</button>
            </div>
            <img className='w-full' src={imageLink || "https://api.lorem.space/image/shoes?w=400&h=225"} alt='Project image' />
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
          <p id='author' className='mb-3 font-mono text-xs'>
            By{" "}
            <a className='underline underline-offset-4' href={authorLink}>
              {author}
            </a>
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
