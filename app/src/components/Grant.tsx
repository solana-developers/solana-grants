import React, { useState } from 'react';

export default function Grant({ setpreview }) {
    const [grant, setGrant] = useState({
        title: '',
        image: '',
        description: '',
        link: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setGrant({ ...grant, [name]: value });
        console.log(grant);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(grant);
    }

    return (
        <>
            <div className="modal" id="my-modal-2">
                <div className="modal-box maingrantbox">
                    <a href="#my-modal-2" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setpreview(false)}>✕</a>
                    <h1 className='text-[3rem] text-center	font-extrabold	mb-[3rem]'>Lets Get Funding!</h1>
                    <div className='grant-main'>
                        <div className='grant-submain' onSubmit={handleSubmit}>
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
                                <a href="#" type="submit" className="btn bg-[#14F195] decoration-[#000] rounded-[20px] w-[210px] h-[38px]"><h1 className='grantbuttonname'>Create Grant</h1></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}