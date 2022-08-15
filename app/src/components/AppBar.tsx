import {FC, useState} from 'react';
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import {useSession, signIn, signOut} from 'next-auth/react';
import ProfileMenu from "./common/profile-menu";

export const AppBar: FC = props => {
    const [isOpen, setIsOpen] = useState(false);
    const {data: session} = useSession()

    return (
        <div>
            <div className="navbar bg-transparent">
                <Link href='/'>
                    <a className="navbar-start">
                        <img src='/images/solana-logo.png' className='ml-4' width={36}/>
                        <p className="normal-case text-2xl pl-3"><b>GRANTS</b></p>
                    </a>
                </Link>

                <div className="navbar-center">
                    <div className="hidden lg:flex">
                        <ul className="menu menu-horizontal p-0">
                            <li><Link href='/explorer'><a>Explore</a></Link></li>
                            <li><a>Menu 2</a></li>
                            <li><a>Menu 3</a></li>
                            <li><a>Menu 4</a></li>
                            <li><a>Menu 5</a></li>
                        </ul>
                    </div>
                    <div className="lg:hidden">
                        <ProfileMenu/>
                    </div>
                </div>

                <div className="mr-2 flex navbar-end lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        {!isOpen ? (
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="navbar-end hidden lg:flex">
                    <div className='mr-4'>
                        <ProfileMenu/>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="lg:hidden bg-black">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <ul className="menu p-0 flex items-center">
                            <li><a>Menu 1</a></li>
                            <li><a>Menu 2</a></li>
                            <li><a>Menu 3</a></li>
                            <li><a>Menu 4</a></li>
                            <li><a>Menu 5</a></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};
