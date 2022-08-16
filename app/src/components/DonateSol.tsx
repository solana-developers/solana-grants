import React, { useState } from "react";
import { notify } from "../utils/notifications";
import Modal from "./Modal";

export default function DonateSol({ setpreview }) {
  const [donation, setDonation] = useState({
    amount: 0,
  });

  const handleSubmit = async () => {
    if (!donation.amount || donation.amount <= 0) {
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
        classNameForModalBoxStyling={"maingrantbox"}
      >
        <h1 className="text-[3rem] text-center	font-extrabold	mb-[2rem]">
          Lets Get Funding!
        </h1>
        <div className="grant-main mb-8">
          <div className="grant-submain">
            <div>
              <label>
                <div className="grantsub">
                  <h1 className="donationamount">Amount:</h1>
                  <input
                    className="amountinput"
                    placeholder="Enter amount"
                    type="number"
                    name="amount"
                  />
                </div>
              </label>
            </div>
            <br />
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
