import { FC } from "react";
import personImage from "../../../public/images/person-opens-the-safe-with-the-money.png";

export const ExplorerView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl mt-20 md:pl-12 font-bold text-white bg-clip-text">
          Fund Public Goods
          <br />
          Help grow Solana!{" "}
        </h1>
        <h4 className="md:w-full text-center text-xl text-white my-5">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            <br /> eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </h4>
        <div className="text-center pt-5">
          <button className="bg-[#14F195] uppercase hover:bg-[#12d986] text-black font-bold py-2 px-12 rounded-full">
            Create grant
          </button>
        </div>
        <div className="pt-10">
          <img src={personImage.src} width="420px" />
        </div>
      </div>
    </div>
  );
};
