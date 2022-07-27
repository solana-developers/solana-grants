import React, {useState} from 'react';
import {useAnchorWallet} from "@solana/wallet-adapter-react";
import getProvider from "../instructions/api/getProvider";
import createGrant from "../instructions/createGrant";
import {GrantModel} from "../models/grant";

// TODO: refactor to show one error if wallet not connected

export default function Grant({setpreview}) {
    const [grant, setGrant] = useState<GrantModel>({});

    const handleChange = (event) => {
        const {name, value} = event.target;
        setGrant({...grant, [name]: value});
    }

    const wallet = useAnchorWallet()
    const provider = getProvider(wallet)

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(await createGrant(provider, grant))
        setpreview(false);
    }

    return (
        <>
            <div className="modal" id="my-modal-2">
                <div className="modal-box maingrantbox">
                    <a href="#my-modal-2" className="btn btn-sm btn-circle absolute right-2 top-2"
                       onClick={() => setpreview(false)}>✕</a>
                    <h1 className='text-[3rem] text-center	font-extrabold	mb-[3rem]'>Lets Get Funding!</h1>

                    <div className='grant-main'>
                        <div className='grant-submain'>
                            <div>
                                <label>
                                    <div className='grantsub'>
                                        <h1 className='grantname'>Grant Title:</h1>
                                        <input className='grantinput' placeholder='Grant Title Field' type="text"
                                               onChange={handleChange} name="info"/>
                                    </div>
                                </label>
                            </div>
                            <br/>
                            <div>
                                <label>
                                    <div className='grantsub'>
                                        <h1 className='grantname'>Grant Description:</h1>
                                        <input className='grantinput' type="text" name="description"
                                               onChange={handleChange} placeholder='Grant Image Field'/>
                                    </div>
                                </label>
                            </div>
                            <br/>
                            <div>
                                <label>
                                    <div className='grantsub'>
                                        <h1 className='grantname'>Grant Image:</h1>
                                        <input className='grantinput' type="text" name="image"
                                               onChange={handleChange} placeholder='Grant Description'/>
                                    </div>
                                </label>
                            </div>
                            <br/>
                            <div>
                                <label>
                                    <div className='grantsub'>
                                        <h1 className='grantname'> Grant Link:</h1>
                                        <input className='grantinput' type="text" placeholder='GitHub Link Field'
                                               onChange={handleChange} name="link"/>
                                    </div>
                                </label>
                            </div>
                            <br/>
                            <div className="modal-action flex justify-center">
                                <button type="button"
                                        className="btn bg-[#14F195] decoration-[#000] rounded-[20px] w-[210px] h-[38px]"
                                        onClick={handleSubmit}><h1 className='grantbuttonname'>Create Grant</h1>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}