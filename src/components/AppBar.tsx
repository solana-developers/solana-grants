import { FC, useState } from 'react';

export const AppBar: FC = props => {

  return (
    <div>
      <div className="navbar bg-transparent">
        <div className="navbar-start">
          <img src='/images/solana-logo.png' className='ml-4' width={36} />
          <a className="normal-case text-2xl pl-3"><b>GRANTS</b></a>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0">
            <li><a>Menu 1</a></li>
            <li><a>Menu 2</a></li>
            <li><a>Menu 3</a></li>
            <li><a>Menu 4</a></li>
            <li><a>Menu 5</a></li>
          </ul>
        </div>
        
        

        <div className="navbar-end hidden lg:flex">
          <div className='mr-4'>
            <div className="btn btn-ghost mr-4 rounded-md">LOGIN</div>
            <div className="btn btn-ghost bg-yellow-500 hover:bg-yellow-600 px-7 rounded-md">REGISTER</div>
          </div>
        </div>
      </div>

      
    </div>
  );
};
