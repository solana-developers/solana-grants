
use anchor_lang::prelude::*;

use crate::{state::{Escrow, EscrowState}, errors::GrantsProgramError};

#[derive(Accounts)]
pub struct CancelEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.receiver().as_ref(), escrow.payer().key().as_ref()],
        bump = escrow.bump()
    )]
    escrow: Account<'info, Escrow>,

    #[account(mut, address = escrow.payer())]
    /// CHECK: We check that the payer provided is the escrow's payer
    payer: AccountInfo<'info>,
}

pub fn cancel_escrow(ctx: Context<CancelEscrow>) -> Result<()> {
    // check that it has funds
    match ctx.accounts.escrow.state {
        EscrowState::Funded => Ok(()),
        EscrowState::Cancelled => err!(GrantsProgramError::CancelledEscrow),
        EscrowState::Released => err!(GrantsProgramError::ReleasedEscrow),
    }?;

    // transfer lamports
    **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= ctx.accounts.escrow.amount();
    **ctx.accounts.payer.try_borrow_mut_lamports()? += ctx.accounts.escrow.amount();

    // update state
    ctx.accounts.escrow.state = EscrowState::Cancelled;

    Ok(())
}