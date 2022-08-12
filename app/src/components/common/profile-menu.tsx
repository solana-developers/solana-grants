import {MdContentCopy, MdDone, MdLogout} from 'react-icons/md';
import {TbBrandGithub, TbUser, TbWallet, TbWalletOff} from 'react-icons/tb';
import React, {useRef, useState} from 'react';
import Card from '../common/card';
import Link from 'next/link';
import Text from '../common/text';
import Chip from '../common/chip';
import Button from '../common/button';
import {signIn, signOut, useSession} from 'next-auth/react';
import Image from '../common/image';
import CustomWalletMultiButton from "./custom-wallet-multi-button";

import {useWallet} from '@solana/wallet-adapter-react';
import DisplayPublicKey from "../../utils/displayPubKey";
import copyText from "../../utils/copyContent";


const OverflowMenu = () => {
    const buttonRef = useRef();
    const {data: session} = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const {wallet, publicKey, connected} = useWallet();

    const onProfileClick = async () => {
        if (session) {
            await signOut();
        } else {
            await signIn('github');
        }
    };

    return (
        <>
            <div className="dropdown-end dropdown">
                <label tabIndex={0}>
                    <div className="flex flex-row items-center gap-3">
                        <Button
                            variant="transparent"
                            icon={TbUser}
                            onClick={() => setMenuOpen(!menuOpen)}
                            ref={buttonRef}
                        />
                    </div>
                </label>
                <Card
                    tabIndex={0}
                    className="bg-opacity-85 dropdown-content mt-3 block w-[calc(100vw-3rem)]
                    bg-[#052C29]
                     sm:w-80"
                >
                    <div className="flex flex-col gap-3 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex w-full flex-col gap-1">
                                <Text
                                    variant="label"
                                    className="text-secondary font-bold text-[#14F195]"
                                >
                                    {' '}
                                    Profile{' '}
                                </Text>
                                <Text
                                    variant="nav-heading"
                                    className={`${session} font-semi-bold text-[#14F195]`}
                                >
                                    {session ? (
                                        <Link
                                            href={`/${session.login}`}
                                            onClick={() => setMenuOpen(false)}
                                            passHref
                                        >
                                            {session.login}
                                        </Link>
                                    ) : (
                                        'Sign in with GitHub'
                                    )}
                                </Text>
                                {!session ? (
                                    <Text
                                        variant="label"
                                        className="!normal-case text-white"
                                    >
                                        Informative text about enhanced
                                        experience, public profile and claiming
                                        bounties.
                                    </Text>
                                ) : (
                                    <div className="flex flex-row items-center gap-1">
                                        <Chip
                                            highlightValue="0"
                                            value="Bounties"
                                        />
                                        <Chip value="Lv. 1"/>
                                    </div>
                                )}
                            </div>
                            {session && (
                                // eslint-disable-next-line jsx-a11y/alt-text
                                <Image
                                    src={session.user.image}
                                    // alt={session.login}
                                    height={40}
                                    className="aspect-square"
                                    style={{borderRadius: '50%'}}
                                />
                            )}
                        </div>
                        <Button
                            text={'Sign ' + (session ? 'out' : 'in')}
                            icon={session ? MdLogout : TbBrandGithub}
                            variant={'orange'}
                            className="!w-full text-black font-bold hover:bg-[#9945FF] bg-[#14F195] border-2 border-[#9945FF] hover:border-black"
                            onClick={onProfileClick}
                        />
                    </div>
                    <div className="h-px w-full bg-line"/>
                    <div className="flex flex-col gap-3 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex w-full flex-col gap-1">
                                <Text
                                    variant="label"
                                    className="text-secondary font-bold text-[#9945FF]"
                                >
                                    {' '}
                                    Wallet{' '}
                                </Text>
                                <Text variant="nav-heading"
                                      className="font-semi-bold text-[#9945FF]">
                                    {connected
                                        ? wallet.adapter.name
                                        : 'Connect your crypto wallet'}
                                </Text>
                                {!connected ? (
                                    <>
                                        <Text
                                            variant="label"
                                            className="!normal-case text-black"
                                        >
                                            Informative text about enhanced
                                            experience, public profile and
                                            claiming bounties.
                                        </Text>
                                    </>
                                ) : (
                                    <div className='flex'>
                                        <CustomWalletMultiButton
                                            text={DisplayPublicKey(publicKey)}
                                            variant="transparent"
                                            connected={connected}
                                            disabled={true}
                                            className="w-full text-black gap-1 mr-2"
                                        />
                                        {/*<Chip copyValue={publicKey.toBase58()}/>*/}

                                        <Button
                                            text={'Copy'}
                                            icon={MdContentCopy}
                                            variant={"transparent"}
                                            className="w-full text-black font-bold hover:bg-[#9945FF] bg-[#14F195] gap-1 border-2 border-[#9945FF] hover:border-black"
                                            onClick={async () => {
                                                await copyText(publicKey.toBase58())
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            {connected && <TbWallet size={25}/>}
                        </div>

                        {connected
                            ? <CustomWalletMultiButton
                                text={"Disconnect"}
                                icon={TbWalletOff}
                                variant="transparent"
                                connected={connected}
                                className="!w-full text-black bg-[#9945FF]"
                            />
                            : <CustomWalletMultiButton
                                text={connected ? 'Disconnect' : 'Connect'}
                                icon={connected ? TbWalletOff : TbWallet}
                                variant="transparent"
                                connected={connected}
                                className="!w-full text-black bg-[#9945FF]"
                            />}
                    </div>
                </Card>
            </div>

            <input type="checkbox" id="wallet-modal" className="modal-toggle"/>
        </>
    );
};

export default OverflowMenu;
