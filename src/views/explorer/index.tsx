import { FC, useEffect, useState } from "react";
import personImage from "../../../public/images/person-opens-the-safe-with-the-money.png";

export const ExplorerView: FC = ({}) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    // TODO: fetch projects for the explorer cards
    setProjects([
      {},
      {},
      {},
      {},
      {},
    ]);
  }, []);

  return (
    <>
      <div className='md:hero mx-auto p-4'>
        <div className='hero-content flex flex-col'>
          <h1 className='text-center text-5xl mt-20 md:pl-12 font-bold text-white bg-clip-text'>
            Fund Public Goods
            <br />
            Help grow Solana!{" "}
          </h1>
          <h4 className='md:w-full text-center text-xl text-white my-5'>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              <br /> eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </h4>
          <div className='text-center pt-5'>
            <button className='bg-[#14F195] uppercase hover:bg-[#12d986] text-black font-bold py-2 px-12 rounded-full'>
              Create grant
            </button>
          </div>
          <div className='pt-10'>
            <img src={personImage.src} width='420px' />
          </div>
        </div>
      </div>
      <div className='mx-auto px-2 lg:container'>
        <div className='flex flex-wrap justify-center gap-4'>
          {projects.map((project, index) => <Card />)}
        </div>
      </div>
    </>
  );
};

/** 
 * TODO: This is just while we merge the explorer card into main
 */ 
const Card: FC = () => {
  return (
    <div className='card w-96 bg-base-100 shadow-xl'>
      <figure>
        <img
          src='https://api.lorem.space/image/shoes?w=400&h=225'
          alt='Shoes'
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className='card-actions justify-end'>
          <button className='btn btn-primary'>Buy Now</button>
        </div>
      </div>
    </div>
  );
};
