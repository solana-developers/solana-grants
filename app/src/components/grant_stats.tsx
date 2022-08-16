import React from 'react';
import {Provider} from "@project-serum/anchor";
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

type GrantStatsProps = {
    provider: Provider
}

let grantStats = [
    {
        id: '1',
        text: 'Grants Created',
        number: 169,
    }, {
        id: '2',
        text: 'Grants Matched',
        number: 135,
    }, {
        id: '3',
        text: 'Grants Released',
        number: 102,
    }, {
        id: '4',
        text: 'SOL Donated',
        number: 1092,
    }
];

const GrantStats = (grantStatsProps: GrantStatsProps) => {

    return (
        <>
            {grantStats.map(
                ({
                     id,
                     text,
                     number,
                 }) => (
                    <div className="carousel-item" key={id}>

                        <div
                            className='slide-content flex justify-center text-2xl items-center w-52 h-56 m-4 bg-cyan-300 rounded-xl'>
                            <div className='flex flex-col text-center font-bold text-purple-700'>
                                <CountUp end={number}>
                                    {({countUpRef, start}) => (
                                        <VisibilitySensor onChange={start} delayedCall>
                                            <span ref={countUpRef}/>
                                        </VisibilitySensor>
                                    )}
                                </CountUp>
                                <div className="text-black">
                                    {`${text}`}
                                </div>
                            </div>
                        </div>
                    </div>
                ),
            )}
        </>
    );
};

export default GrantStats;
