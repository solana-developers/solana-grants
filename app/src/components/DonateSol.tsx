import { BN, AnchorError } from "@project-serum/anchor";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { processed, DEVNET_API } from "../constants";
import React, { useState } from "react";
import { makeDonation } from "transactions";
import { notify } from "../utils/notifications";
import { DonationChart } from "./DonationChart";
import Modal from "./Modal";
import { useWallet } from "@solana/wallet-adapter-react";
import getProvider from "../instructions/api/getProvider";
import getProgram from "instructions/api/getProgram";
import { toastError, toastSuccess } from "./Toast";

export default function DonateSol({ setpreview, grantPDA, setRaisedSol }) {
  const [donation, setDonation] = useState(0);

  const wallet = useWallet();

  const handleSubmit = async () => {
    if (!donation || donation <= 0) {
      return notify({
        type: "error",
        message: "error",
        description: "Please enter a valid amount",
      });
    }
    const provider = getProvider(wallet);
    const program = getProgram(provider);

    const lamports = donation * LAMPORTS_PER_SOL;

    try {
      const sig = await makeDonation(
        program,
        wallet?.publicKey,
        grantPDA,
        new BN(lamports)
      );
      console.log("successful donation: " + sig);
      toastSuccess("Donation successful, transaction signature: " + sig);
      const newBalance = await provider.connection.getBalance(grantPDA);
      setRaisedSol((newBalance / LAMPORTS_PER_SOL).toFixed(0));
    } catch (e) {
      if (e instanceof AnchorError) {
        console.log(e);
        const err: AnchorError = e;
        toastError(err.error.errorMessage);
        return;
      }
      toastError("Something went wrong! Please try again later");
      return;
    }
    
  };

  return (
    <>
      <Modal
        setpreview={setpreview}
        showCloseButton={true}
        classNameForModalBoxStyling={"donatebox"}
        id={"donate"}
      >
        <h1 className='text-[3rem] text-center	font-extrabold	mb-[2rem]'>
          Lets Get Funding!
        </h1>
        <div className='mb-8 grant-main'>
          <div className='bg-solana-purple/50 ml-[3rem] rounded-tl-[6.875rem] rounded-bl-[6.875rem] items-center p-[2.5rem] space-y-4 justify-end'>
            <div className='flex flex-col items-center hidden space-y-4'>
              <div className='form-control'>
                <label className='input-group'>
                  <span>Donate</span>
                  <input
                    className='w-32 input input-sm input-bordered'
                    type='number'
                    placeholder='10'
                    onChange={(e) =>
                      setDonation(Number.parseFloat(e.target.value))
                    }
                    min={0}
                  />
                  <span>SOL</span>
                </label>
              </div>

              <div className='form-control'>
                <label className='input-group'>
                  <span>Grant gets</span>
                  <input
                    type='number'
                    placeholder='10'
                    disabled
                    className='w-32 input input-sm input-bordered'
                  />
                  <span>SOL</span>
                </label>
              </div>
            </div>
            <div className='flex justify-evenly'>
              <div className='flex items-center justify-end space-x-2'>
                <label htmlFor='you-donate'>You donate:</label>
                <input
                  className='w-24 input input-sm'
                  placeholder='0'
                  type='number'
                  min={0}
                  name='you-donate'
                  onChange={(e) =>
                    setDonation(Number.parseFloat(e.target.value))
                  }
                />
              </div>
              <div className='flex items-center justify-end space-x-2'>
                <label htmlFor='grant-gets'>Grant gets:</label>
                <input
                  type='number'
                  name='grant-gets'
                  disabled
                  className='w-24 input input-sm'
                  value={donation * 2}
                />
              </div>
            </div>
            <br />
            <DonationChart matchRatio={(x) => x} donation={donation} />

            <div className='flex justify-center modal-action'>
              <button
                className='btn bg-[#14F195] decoration-[#000] rounded-[20px] w-[210px] h-[38px]'
                onClick={handleSubmit}
              >
                <h1 className='grantbuttonname'>Donate</h1>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
