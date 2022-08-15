import React from 'react';
import { TransactionDetail } from "../constants/types"

type Props = {
  transactionsList: Array<TransactionDetail>
}

export default function TransactionSeries({ transactionsList }: Props) {
  return (
    <>
      <div>
        {transactionsList.length > 0 && transactionsList.map((transaction, num) => (
          <div key={'transaction-' + num} className='flex my-5'>
            <div className='mr-5'>
              {transaction.isCompleted ? (
                <div className='h-7 w-7 bg-sky-500 flex justify-center items-center rounded-full'>
                  <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 6L4.1875 11L9.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <div className='w-7 h-7 rounded-full animate-spin loading-spinner-gradients'></div>
              )}
            </div>
            <p className='text-xl'>{transaction.info}</p>
          </div>
        ))}
      </div>
    </>
  );
}