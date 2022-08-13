import { contrastColor } from "contrast-color";
import { FC } from "react";

export interface ExploreCardProps {
  image: string;
  bgColor: string;
  title: string;
  author: string;
  authorLink: string;
  summary: string;
  projectLink: string;
  amtRaised: number;
  numContributors: number;
}

/**
 * A card to show a summary of a project in the explorer view.
 * @param bgColor is expected to be taken from the image, ideally provided by the backend
 */
export const ExploreCard: FC<ExploreCardProps> = ({
  image,
  bgColor,
  title,
  author,
  authorLink,
  summary,
  projectLink,
  amtRaised,
  numContributors,
}) => {
  const roundedAmtRaised = Math.round(amtRaised);
  const textColor = contrastColor({
    bgColor,
    fgLightColor: "text-slate-200",
    fgDarkColor: "text-slate-800",
  });
  return (
    <>
      <div className='shadow-xl card w-96 bg-base-100'>
        <a href={projectLink}>
          <figure className='relative'>
            <div className='absolute flex w-full h-full transition-opacity opacity-0 bg-slate-700 hover:opacity-90'>
              <button className='m-auto btn btn-secondary'>Learn More</button>
            </div>
            <img className='w-full' src={image} alt='Project image' />
          </figure>
        </a>
        <div
          className={"card-body " + textColor}
          style={{ background: bgColor }}
        >
          <a href={projectLink}>
            <h2 id='title' className='mb-1 font-mono card-title'>
              {title}
            </h2>
          </a>
          <p id='author' className='mb-3 font-mono text-xs'>
            By{" "}
            <a className='underline underline-offset-4' href={authorLink}>
              {author}
            </a>
          </p>
          <p
            id='summary'
            className={"line-clamp-3 text-opacity-90 " + textColor}
          >
            {summary}
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
                ${roundedAmtRaised}
              </p>
              Raised from <strong>{numContributors}</strong> supporters
            </p>
            <button className='m-auto btn btn-primary'>Donate</button>
          </div>
        </div>
      </div>
    </>
  );
};

export const _exampleCard = (
  <ExploreCard
    image='https://api.lorem.space/image/shoes?w=400&h=225'
    bgColor='#001020'
    title='Minter Project'
    author='minter.sol'
    authorLink='https://minter.sol'
    summary='Make minting process easier with this framework and then do a lot of subsequent lines until we reach more than 3 lines to test for line clamping'
    projectLink='https://solanagrants.com/minter-project'
    amtRaised={3012.892}
    numContributors={76}
  />
);
