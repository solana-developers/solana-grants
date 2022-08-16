import { FC , useState } from "react";
import { contrastColor } from "contrast-color";
import sendSol from '../utils/sendSol';
import { useWallet } from "@solana/wallet-adapter-react";
import { notify } from '../utils/notifications';

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
  const textColor = contrastColor({ bgColor, fgLightColor: "text-slate-200", fgDarkColor: "text-slate-800", });

  const wallet = useWallet();

  const [isSending, setIsSending] = useState(false);
  const [amountDonated, setAmountDonated] = useState(0);

  async function send(){

    if(!wallet || !wallet.connected){
      notify({ type: "error", message: "error", description: "You must be connected to a wallet to send funds" });
      return;
    }
    if(amountDonated <= 0){
      notify({ type: "error", message: "error", description: "Enter a valid amount" });
      return;
    }
    setIsSending(true);
    const response = await sendSol(wallet, author, amountDonated);
    if (response.err){
      notify({ type: "error", message: "error", description: "" });
    }
    else{
      notify({ type: "success", message: "Success", description: "Successfully Donated" });
    }
    setIsSending(false);
  }
  return (
    <>
      <div className='card w-[23rem] h-[36rem] bg-base-100 shadow-xl'>
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
            <p className={'font-mono text-sm m-1 text-right text-opacity-90 ' + textColor}>
              <p className={'text-xl text-left font-semibold color-green ' + textColor}>${roundedAmtRaised}</p>
              Raised from <strong>{numContributors}</strong> supporters
            </p>
            <div className="dropdown dropdown-right dropdown-down">
              <label  className="btn m-1">Donate</label>
              <ul  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><label htmlFor="my-modal" className="btn modal-button">Donate Directly</label></li>

                <li><a>Matching</a></li>
              </ul>
            </div>
            <input type="checkbox" id="my-modal" className="modal-toggle" />
                <div className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-white	m-[0.8rem] text-lg">Enter the amount to donate</h3>

                    <input type="number" placeholder="Type here" className="input w-full max-w-xs  text-white border-zinc-50" onChange={
                      (e) =>{
                        setAmountDonated(parseFloat(e.target.value));
                      }
                    } />
                    <div className="modal-action">
                      <label htmlFor="my-modal" className="btn" onClick={send}>Submit</label>
                      <label htmlFor="my-modal" className="btn">Cancel</label>
                    </div>
                  </div>
                </div>
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
