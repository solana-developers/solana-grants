import { FC, useState } from 'react';
import uploadToWeb3DB from '../../utils/uploadToWeb3DB';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import GetProvider from '../../utils/getProvider';

import { notify } from "../../utils/notifications";
import { useWallet } from '@solana/wallet-adapter-react';
import { TransactionDetail } from '../../constants/types';
import { GrantModel } from '../../models/grant';
import createGrant from '../../instructions/createGrant';
import TransactionSeries from '../../components/TransactionSeries';
import { useSession } from 'next-auth/react';

export const GrantCreationFlowView: FC = ({ }) => {
  const [active, setactive] = useState(1);
  const [grant, setGrant] = useState({
    title: "",
    imageLink: "",
    about: "",
    description: "",
    projectGithubLink: "",
    dueDate: "",
    targetAmount: "",
    projectWebsite: ""
  });

  const [transactionsList, setTransactionsList] = useState<Array<TransactionDetail>>([
    {
      info: "Funding the Bundlr node",
      isCompleted: false
    },
    {
      info: "Uploading data to Arweave (message signing)",
      isCompleted: false
    },
    {
      info: "Sending your data to the blockchain",
      isCompleted: false
    }
  ]);

  const wallet = useWallet();
  const githubAuthSession = useSession();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setGrant({ ...grant, [name]: value });
  }

  const runValidations = () => {
    if (active == 1) {
      if (!wallet || !wallet.connected) {
        notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
        return false;
      }

      if (!githubAuthSession || !githubAuthSession.data) {
        notify({ type: 'error', message: 'error', description: 'Please sign in with your GitHub Account' });
        return false;
      }

      if (!grant.title || !grant.description || !grant.about || !grant.imageLink || !grant.projectGithubLink || !grant.dueDate || !grant.targetAmount) {
        notify({ type: 'error', message: 'error', description: 'Please fill in all the fields!' });
        return false;
      }

      if (parseFloat(grant.targetAmount) <= 0) {
        notify({ type: 'error', message: 'error', description: 'target amount must be greater than zero' });
        return false;
      }
  
      if (new Date(grant.dueDate + " 00:00:00").getTime() <= new Date().getTime()) {
        notify({ type: 'error', message: 'error', description: 'Due date entered must be in the future!' });
        return false;
      }
    }
    return true;
  }

  const goToPreviousSection = () => {
    setactive(active - 1);
  }

  const goToNextSection = () => {
    const isValidated = runValidations();
    if (isValidated) {
      setactive(active + 1);
      if (active + 1 == 4) {
        handleSubmit();
      }
    }
  }

  const handleSubmit = async () => {
    const grantDetailsToBeUploaded = {
      title: grant.title,
      imageLink: grant.imageLink,
      about: grant.about,
      description: grant.description,
      projectGithubLink: grant.projectGithubLink,
      projectWebsite: grant.projectWebsite,
      githubUserId: githubAuthSession.data.userId
    };

    const uploadResult = await uploadToWeb3DB(wallet, grantDetailsToBeUploaded, setTransactionsList);

    if (uploadResult.err) {
      notify({ type: 'error', message: 'error', description: 'Something went wrong! Please try again later' });
      setactive(active - 1);
      return;
    }

    const grantDetails: GrantModel = {
      info: uploadResult.id,
      targetLamports: parseFloat(grant.targetAmount) * LAMPORTS_PER_SOL,
      dueDate: new Date(grant.dueDate + " 23:59:59").getTime()
    }

    const provider = await GetProvider(wallet);
    const grantCreationResult = await createGrant(provider, grantDetails);

    if (grantCreationResult.err) {
      notify({ type: 'error', message: 'error', description: 'Something went wrong! Please try again later' });
      setactive(active - 1);
      return;
    }

    setTransactionsList((transactionsList) => {
      const newTransactionsList = [...transactionsList];
      newTransactionsList[uploadResult.transactionCount].isCompleted = true;
      return newTransactionsList;
    })
    
    notify({ type: 'success', message: 'success', description: 'Grant created successfully' });
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="creategrant w-[63rem]">
          <div className="mx-4 p-4">
            <div className="flex items-center">
              <div className="flex items-center text-white relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600">
                </div>
                <div className="grantheading absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">Grant Details</div>
              </div>
              <div className={active == 2 || active == 3 || active == 4 ? 'flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600' : 'flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300'}></div>
              <div className="flex items-center text-gray-500 relative">
                <div className={active == 2 || active == 3 || active == 4 ? 'rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600' : 'rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300'}>
                </div>
                <div className={active == 2 || active == 3 || active == 4 ? 'grantheading absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600' : 'grantheading absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500'}>Creator Details</div>
              </div>
              <div className={active == 3 || active == 4 ? 'flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600' : 'flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300'}></div>
              <div className="flex items-center text-gray-500 relative">
                <div className={active == 3 || active == 4 ? 'rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600' : 'rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300'}>
                </div>
                <div className={active == 3 || active == 4 ? 'grantheading absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600' : 'grantheading absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500'}>Review Grant</div>
              </div>
              <div className={active == 4 ? 'flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600' : 'flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300'}></div>
              <div className="flex items-center text-gray-500 relative">
                <div className={active == 4 ? 'rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600' : 'rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300'}>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">Create Grant</div>
              </div>
            </div>
          </div>
          <div className="grantborder border-t-2 w-[63rem] mt-[4rem] border-gray-300"></div>
          <div className={active == 1 ? 'mt-8 p-4' : 'hidden'}>
            <div>
              <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
                <h1>Grant Details</h1>
              </div>

              <div className="font-bold text-white text-s leading-8 uppercase h-6 mx-2 mt-3">Title*</div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Grant Title" name="title" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" onChange={handleChange} /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> About*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="About.." name="about" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" onChange={handleChange} /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Description*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Grant Description.." name="description" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" onChange={handleChange} /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Project Header URl*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Your Project Header URl.." name="imageLink" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" onChange={handleChange} /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Project GitHub URl*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Your Project GitHub URl.." name="projectGithubLink" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" onChange={handleChange} /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Project Website</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Your Project Website.." name="projectWebsite" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" onChange={handleChange} /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Amount Goal in SOL*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Amount Goal.." type="number" name="targetAmount" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" onChange={handleChange} /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Due Date*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Due Date" type="date" name="dueDate" className="p-1 px-2 appearance-none outline-none w-full text-gray-800" onChange={handleChange} /> </div>
                </div>
              </div>
            </div>
            <div className="flex p-2 mt-4">
              <div className="flex-auto flex flex-row-reverse">
                <button className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                  hover:bg-teal-600  
                  bg-teal-600 
                  text-teal-100 
                  border duration-200 ease-in-out 
                  border-teal-600 transition"
                  disabled={active == 4}
                  onClick={goToNextSection}
                >Next</button>
              </div>
            </div>
          </div>
          <div className={active == 2 ? 'mt-8 p-4' : 'hidden'}>
            <div>
              <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
                <h1>Creator Details</h1>
              </div>

              <div className="font-bold text-white text-s leading-8 uppercase h-6 mx-2 mt-3">Name*</div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Name" value={githubAuthSession?.data?.user?.name || ""} disabled className="p-1 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Wallet Address*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <input placeholder="Wallet Address" value={wallet?.publicKey?.toString() || ""} disabled className="p-1 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
            </div>
            <div className="flex p-2 mt-4">
              <button className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                  hover:bg-gray-200  
                  bg-gray-100 
                  text-gray-700 
                  border duration-200 ease-in-out 
                  border-gray-600 transition"
                disabled={active == 1}
                onClick={goToPreviousSection}
              >Previous</button>
              <div className="flex-auto flex flex-row-reverse">
                <button className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                  hover:bg-teal-600  
                  bg-teal-600 
                  text-teal-100 
                  border duration-200 ease-in-out 
                  border-teal-600 transition"
                  disabled={active == 4}
                  onClick={goToNextSection}
                >Next</button>
              </div>
            </div>
          </div>
          <div className={active == 3 ? 'mt-8 p-4' : 'hidden'}>
            <div className="font-bold text-white text-2xl leading-8 uppercase h-6 mx-2 mt-3">
              <h1>Review Grants</h1>
            </div>
            <div className="grantborder border-t-2 w-[63rem] mt-[3rem]  border-gray-300"></div>
            <div>
              <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
                <h1>Grant Details</h1>
              </div>

              <div className="font-bold text-white text-s leading-8 uppercase h-6 mx-2 mt-3">Title*</div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" values='abcd' /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> About*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Description*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Project Header URl*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Project GitHub URl*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Project Website*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Amount Goal in SOL*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Due Date*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
            </div>
            <div>

              <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
                <h1>Creator Details</h1>
              </div>

              <div className="font-bold text-white text-s leading-8 uppercase h-6 mx-2 mt-3">Name*</div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> GitHub Handle*</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                  <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase"> Wallet Address</div>
                  <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                    <text className="p-4 px-2 appearance-none outline-none w-full text-gray-800" /> </div>
                </div>
              </div>
            </div>
            <div className="flex p-2 mt-4">
              <button className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                hover:bg-gray-200  
                bg-gray-100 
                text-gray-700 
                border duration-200 ease-in-out 
                border-gray-600 transition"
                disabled={active == 1}
                onClick={goToPreviousSection}
              >Previous</button>
              <div className="flex-auto flex flex-row-reverse">
                <button className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                  hover:bg-teal-600  
                  bg-teal-600 
                  text-teal-100 
                  border duration-200 ease-in-out 
                  border-teal-600 transition"
                  disabled={active == 4}
                  onClick={goToNextSection}
                >Next</button>
              </div>
            </div>
          </div>
          <div className={active == 4 ? 'mt-8 p-4' : 'hidden'}>
            <div>
              <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
                <h1>Creating Grant</h1>
              </div>
              <div className="my-12">
                <TransactionSeries transactionsList={transactionsList} />
              </div>
            </div>
            <div className="flex p-2 mt-4">
              <button className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
                hover:bg-gray-200  
                bg-gray-100 
                text-gray-700 
                border duration-200 ease-in-out 
                border-gray-600 transition"
                disabled={active == 1 || active == 4}
                onClick={goToPreviousSection}
              >Previous</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}