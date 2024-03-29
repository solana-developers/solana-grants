import { useState } from "react";
import { contrastColor } from "contrast-color";
import { BN } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/router";
import { DEFAULT_GRANT_HEADER_IMAGE } from "../constants";

export interface ExploreCardProps {
  imageLink: string;
  title: string;
  author: string;
  authorLink: string;
  about: string;
  githubProjectLink: string;
  numDonors: number;
  lamportsRaised: BN | number;
  idx: number;
}

/**
 * A card to show a description of a project in the explorer view.
 * @param bgColor is expected to be taken from the image, ideally provided by the backend
 */
export const ExploreCard = ({
  imageLink,
  title,
  author,
  authorLink,
  about,
  githubProjectLink,
  numDonors,
  lamportsRaised,
  idx
}: ExploreCardProps) => {
  const roundedAmtRaised = (lamportsRaised as number / LAMPORTS_PER_SOL).toFixed(3);
  const textColor = contrastColor({ bgColor: "yellow", fgLightColor: "text-slate-200", fgDarkColor: "text-slate-800", });
  const router = useRouter();
  const [image, setImage] = useState(imageLink);

  const goToGrantDetailView = () => {
    router.push(`/grant/${idx}`);
  }

  return (
    <>
      <div className='shadow-xl card w-96 bg-base-100'>
        <a href={githubProjectLink}>
          <figure className='relative'>
            <div className='absolute flex w-full h-full transition-opacity opacity-0 bg-slate-700 hover:opacity-90'>
              <button
                className='m-auto btn btn-secondary'
                onClick={goToGrantDetailView}
              >
                Learn More
              </button>
            </div>
            <img
              className='w-full'
              onError={() => {
                setImage(DEFAULT_GRANT_HEADER_IMAGE);
              }}
              src={image}
              alt='Project image'
            />
          </figure>
        </a>
        <div
          className={"card-body " + textColor}
          style={{ background: "yellow" }}
        >
          <a href={githubProjectLink}>
            <h2 id='title' className='mb-1 font-mono card-title'>
              {title}
            </h2>
          </a>
          <p id='author' className='flex mb-3 font-mono text-xs'>
            By{" "}
            {author ? (
              <a
                className='ml-2 underline underline-offset-4'
                href={authorLink}
              >
                {author}
              </a>
            ) : (
              <div className='w-3 h-3 ml-2 rounded-full animate-spin loading-spinner-gradients'></div>
            )}
          </p>
          <p id='about' className={"line-clamp-3 text-opacity-90 " + textColor}>
            {about}
          </p>
          <div className='card-actions'>
            <p
              className={
                "font-mono mx-auto text-sm text-right text-opacity-90 " +
                textColor
              }
            >
              <p
                className={
                  "text-xl text-left font-semibold color-green " + textColor
                }
              >
                ◎{roundedAmtRaised} SOL
              </p>
              Raised from <strong>{numDonors}</strong> supporters
            </p>
            <button className='m-auto btn btn-primary'>Donate</button>
          </div>
        </div>
      </div>
    </>
  );
};
