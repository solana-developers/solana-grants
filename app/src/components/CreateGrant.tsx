import { TransactionDetail } from 'constants/types';
import React, { useState } from 'react';
import Modal from "./Modal";
import TransactionSeries from './TransactionSeries';

export default function CreateGrant({ setpreview }) {
  const [grant, setGrant] = useState({
    title: '',
    image: '',
    description: '',
    link: '',
  });

  const [showTransactionFlow, setShowTransactionFlow] = useState(false);
  const [transactionsDetails, setTransactionsDetails] = useState<Array<TransactionDetail>>([
    {
      info: "Uploading data to Arweave",
      isCompleted: true
    },
    {
      info: "Message signing",
      isCompleted: false
    },
    {
      info: "Sending your data to the blockchain",
      isCompleted: false
    }
  ]);

  const wallet = useWallet();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setGrant({ ...grant, [name]: value });
    console.log(grant);
  }

  const handleSubmit = async () => {
    if (!grant.description || !grant.image || !grant.link || !grant.title || !grant.dueDate || !grant.targetAmount) {
      return notify({ type: 'error', message: 'error', description: 'Please fill in all the fields!' });
    }

    if (new Date(grant.dueDate + "00:00:00").getTime() <= new Date().getTime()) {
      return notify({ type: 'error', message: 'error', description: 'Due date entered must be in the future!' });
    }

    if (grant.targetAmount <= 0) {
      return notify({ type: 'error', message: 'error', description: 'target amount must be greater than zero' });
    }

    if (!wallet || !wallet.connected) {
      return notify({ type: 'error', message: 'error', description: 'Wallet not connected!' });
    }
    
    setShowTransactionFlow(true);
    
    const uploadResult = await uploadToWeb3DB(wallet, grant, setTransactionsList);
    // console.log(uploadResult);

    if (uploadResult.err) {
      setpreview(false);
      return notify({ type: 'error', message: 'error', description: 'Something went wrong! Please try again later' });
    }

    const grantDetails: GrantModel = {
      info: uploadResult.id,
      targetLamports: grant.targetAmount * LAMPORTS_PER_SOL,
      dueDate: new Date(grant.dueDate + "23:59:59").getTime()
    }

    const provider = await GetProvider(wallet);
    const grantCreationResult = await createGrant(provider, grantDetails);

    if (grantCreationResult.err) {
      setpreview(false);
      return notify({ type: 'error', message: 'error', description: 'Something went wrong! Please try again later' });
    }

    setTransactionsList((transactionsList) => {
      const newTransactionsList = [...transactionsList];
      newTransactionsList[uploadResult.transactionCount].isCompleted = true;
      return newTransactionsList;
    })
    
    notify({ type: 'success', message: 'success', description: 'Grant created successfully' });
    setpreview(false);
  }

  return (
    <>
      <Modal setpreview={setpreview} showCloseButton={true} classNameForModalBoxStyling={"maingrantbox"}>
        <h1 className='text-[3rem] text-center	font-extrabold	mb-[3rem]'>Lets Get Funding!</h1>
        <div className='grant-main mb-16'>
          <div className='grant-submain'>
            {showTransactionFlow ? (
              <TransactionSeries transactionsList={transactionsDetails} />
            ) : (
              <>
                <div>
                  <label>
                    <div className='grantsub'>
                      <h1 className='grantname'>Grant Title:</h1>
                      <input className='grantinput' placeholder='Grant Title Field' type="text" name="title" onChange={handleChange} />
                    </div>
                  </label>
                </div>
                <br />
                <div>
                  <label>
                    <div className='grantsub'>
                      <h1 className='grantname'>Grant Description:</h1>
                      <input className='grantinput' type="text" name="description" placeholder='Grant Image Field' onChange={handleChange} />
                    </div>
                  </label>
                </div>
                <br />
                <div>
                  <label>
                    <div className='grantsub'>
                      <h1 className='grantname'>Grant Image:</h1>
                      <input className='grantinput' type="text" name="image" placeholder='Grant Description' onChange={handleChange} />
                    </div>
                  </label>
                </div>
                <br />
                <div>
                  <label>
                    <div className='grantsub'>
                      <h1 className='grantname'> Grant Link:</h1>
                      <input className='grantinput' type="text" placeholder='GitHub Link Field' name="link" onChange={handleChange} />
                    </div>
                  </label>
                </div>
                <br />
                <div className="modal-action flex justify-center">
                  <button className="btn bg-[#14F195] decoration-[#000] rounded-[20px] w-[210px] h-[38px]" onClick={handleSubmit}>
                    <h1 className='grantbuttonname'>Create Grant</h1>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}