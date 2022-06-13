import { FC } from "react";

interface Props {
  title: string;
  author: string;
  authorLink: string;
  description: string;
  projectLink: string;
}

export const ExplorerCard: FC<Props> = ({
  title,
  author,
  authorLink,
  description,
  projectLink,
}) => {
  return (
    <>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <a href={projectLink}>
          <figure>
            <img
              src='https://api.lorem.space/image/shoes?w=400&h=225'
              alt='Shoes'
            />
          </figure>
        </a>
        <div className='card-body'>
          <a href={projectLink}>
            <h2 id='title' className='card-title mb-1'>
              {title}
            </h2>
          </a>
          <p id='author' className='text-xs mb-3'>
            By{" "}
            <a className='underline underline-offset-4' href={authorLink}>
              {author}
            </a>
          </p>
          <p id='description' className='line-clamp-3'>
            {description}
          </p>
          <div className='card-actions'>
            <div className='grid grid-cols-4 gap-2'>
              <div className='col-span-3'>
                <label className='input-group'>
                  <input
                    type='text'
                    placeholder='0.01'
                    className='input input-bordered w-3/4'
                  />
                  <span>SOL</span>
                </label>
              </div>
              <button className='btn btn-primary col-span-1'>Donate</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const _exampleCard = (
  <ExplorerCard
    title='Minter Project'
    author='minter.sol'
    authorLink='https://minter.sol'
    description='Make minting process easier with this framework and then do a lot of subsequent lines until we reach more than 3 lines to test for line clamping'
    projectLink='https://solanagrants.com/minter-project'
  />
);