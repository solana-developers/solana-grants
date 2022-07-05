
use anchor_lang::{prelude::*, solana_program::{program::invoke, system_instruction}};

use crate::{state::{Escrow, EscrowState}, errors::GrantsProgramError};

#[derive(Accounts)]
pub struct IncrementEscrow<'info> {

    #[account(
        mut, 
        seeds = [b"escrow", escrow.receiver().as_ref(), escrow.payer().key().as_ref()],
        bump = escrow.bump()
    )]
    escrow: Account<'info, Escrow>,

    #[account(mut, constraint = escrow.payer() == payer.key())]
    payer: Signer<'info>,
    
    system_program: Program<'info, System>
}

pub fn increment_escrow(ctx: Context<IncrementEscrow>, lamports: u64) -> Result<()> {

    // require_keys_eq!(ctx.accounts.escrow.payer(), ctx.accounts.payer.key());

    // check that it is active
    match ctx.accounts.escrow.state {
        EscrowState::Funded => Ok(()),
        EscrowState::Cancelled => err!(GrantsProgramError::CancelledEscrow),
        EscrowState::Released => err!(GrantsProgramError::ReleasedEscrow),
    }?;

    // transfer lamports
    invoke(
        &system_instruction::transfer(
            &ctx.accounts.payer.key(),
            &ctx.accounts.escrow.key(),
            lamports
        ), 
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.escrow.to_account_info(),
        ]
    )?;

    Ok(())
}