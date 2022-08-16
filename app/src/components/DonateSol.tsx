import React, { useState } from "react";
import { notify } from "../utils/notifications";
import { DonationChart } from "./DonationChart";
import Modal from "./Modal";

export default function DonateSol({ setpreview }) {
  const [donation, setDonation] = useState(0);

  const handleSubmit = async () => {
    if (!donation || donation <= 0) {
      return notify({
        type: "error",
        message: "error",
        description: "Please enter a valid amount",
      });
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
        <h1 className="text-[3rem] text-center	font-extrabold	mb-[2rem]">
          Lets Get Funding!
        </h1>
        <div className="grant-main mb-8">
          <div className="bg-solana-purple/50 ml-[3rem] rounded-tl-[6.875rem] rounded-bl-[6.875rem] items-center p-[2.5rem] space-y-4 justify-end">
            <div className="hidden flex flex-col  space-y-4 items-center">
              <div className="form-control">
                <label className="input-group">
                  <span>Donate</span>
                  <input
                    className="input input-sm input-bordered w-32"
                    type="number"
                    placeholder="10"
                    onChange={(e) =>
                      setDonation(Number.parseFloat(e.target.value))
                    }
                    min={0}
                  />
                  <span>SOL</span>
                </label>
              </div>

              <div className="form-control">
                <label className="input-group">
                  <span>Grant gets</span>
                  <input
                    type="number"
                    placeholder="10"
                    disabled
                    className="input input-sm input-bordered w-32"
                  />
                  <span>SOL</span>
                </label>
              </div>
            </div>
            <div className="flex justify-evenly">
              <div className="flex justify-end items-center space-x-2">
                <label htmlFor="you-donate">You donate:</label>
                <input
                  className="input input-sm w-24"
                  placeholder="1"
                  type="number"
                  min={0}
                  name="you-donate"
                  onChange={(e) =>
                    setDonation(Number.parseFloat(e.target.value))
                  }
                />
              </div>
              <div className="flex justify-end items-center space-x-2">
                <label htmlFor="grant-gets">Grant gets:</label>
                <input
                  type="number"
                  name="grant-gets"
                  disabled
                  className="input input-sm w-24"
                  value={donation * 2}
                />
              </div>
            </div>
            <br />
            <DonationChart matchRatio={(x) => x} donation={donation} />

            <div className="modal-action flex justify-center">
              <button
                className="btn bg-[#14F195] decoration-[#000] rounded-[20px] w-[210px] h-[38px]"
                onClick={handleSubmit}
              >
                <h1 className="grantbuttonname">Donate</h1>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
