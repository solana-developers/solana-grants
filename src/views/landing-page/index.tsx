import { FC } from 'react';

export const LandingPageView: FC = ({ }) => {
  const sectionDimensions = {
    width: 400,
    height: 350,
  };

  return (
    <div className='flex justify-center my-20'>
      <div className='flex justify-center hidden md:block' style={sectionDimensions}>
        <img src='/images/bitcoin-man.png' />
      </div>
      <div className='flex items-center' style={sectionDimensions}>
        <div className='flex flex-col items-center md:items-start m-8 md:m-5'>
          <div className='my-5 mt-8'>
            <b className="normal-case text-4xl">Grants Copy</b>
          </div>
          <div>
            <p className="normal-case text-lg text-center md:text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className='flex justify-center mt-8'>
            <button className="bg-green-400 hover:bg-emerald-500 py-2 px-9 text-black text-sm rounded-full mr-4">
              EXPLORE
            </button>
            <button className="bg-transparent hover:bg-slate-500 py-2 px-6 text-fuchsia-300 border border-fuchsia-300 text-sm rounded-full">
              CREATE A GRANT
            </button>
          </div>
        </div> 
      </div>
    </div>
  );
};
