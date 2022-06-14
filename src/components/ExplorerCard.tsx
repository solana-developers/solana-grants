import { FC } from "react";

interface Props {
  title: string;
  author: string;
  authorLink: string;
  summary: string;
  projectLink: string;
  amtRaised: number;
  numContributors: number;
}

export const ExplorerCard: FC<Props> = ({
  title,
  author,
  authorLink,
  summary,
  projectLink,
  amtRaised,
  numContributors,
}) => {
  const roundedAmtRaised = Math.round(amtRaised);
  return (
    <>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <a href={projectLink}>
          <figure className='relative'>
            <div className='w-full h-full bg-slate-200 absolute transition-opacity opacity-0 hover:opacity-80 flex'>
              <button className='btn btn-primary m-auto'>Donate</button>
            </div>
            <img
              className='w-full'
              src='https://api.lorem.space/image/shoes?w=400&h=225'
              alt='Shoes'
            />
          </figure>
        </a>
        <div className='card-body'>
          <a href={projectLink}>
            <h2 id='title' className='card-title mb-1 font-mono'>
              {title}
            </h2>
          </a>
          <p id='author' className='text-xs mb-3 font-mono'>
            By{" "}
            <a className='underline underline-offset-4' href={authorLink}>
              {author}
            </a>
          </p>
          <p id='description' className='line-clamp-3 text-slate-200'>
            {summary}
          </p>
          <div className='card-actions'>
            <p className='font-mono mx-auto text-sm text-center'>
              <p className='text-xl text-center'>
                ${roundedAmtRaised}
              </p>
              Raised from {numContributors} supporters</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const _exampleCard = (
  <ExplorerCard
    title='Minter Project'
    author='minter.sol'
    authorLink='https://minter.sol'
    summary='Make minting process easier with this framework and then do a lot of subsequent lines until we reach more than 3 lines to test for line clamping'
    projectLink='https://solanagrants.com/minter-project'
    amtRaised={3012.892}
    numContributors={76}
  />
);