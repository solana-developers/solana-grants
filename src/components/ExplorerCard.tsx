import { FC } from "react";

export const ExplorerCard: FC = (props) => {
  return (
    <>
      <div className='card w-96 bg-base-100 shadow-xl'>
        <figure>
          <img
            src='https://api.lorem.space/image/shoes?w=400&h=225'
            alt='Shoes'
          />
        </figure>
        <div className='card-body'>
          <h2 id='title' className='card-title mb-1'>Minter Project</h2>
          <p id='author' className="text-xs mb-3">By Address/.sol domain</p>
          <p id='description' className="line-clamp-3">Make minting process easier with this framework and then do a lot of subsequent lines until we reach more than 3 lines to test for line clamping</p>
          <div className='card-actions grid grid-cols-4'>
            <div className="col-span-3">
            <label className='input-group'>
              <input
                type='text'
                placeholder='0.01'
                className='input input-bordered'
                />
              <span>SOL</span>
            </label>
                </div>
            <button className='btn btn-primary col-span-1'>Donate</button>
          </div>
        </div>
      </div>
    </>
  );
};
