
use anchor_lang::prelude::*;

use crate::{state::{Escrow, EscrowState}, errors::GrantsProgramError};

#[derive(Accounts)]
pub struct CancelEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.receiver().as_ref(), donor.key().as_ref()],
        bump = escrow.bump()
    )]
    escrow: Account<'info, Escrow>,

    #[account(mut, constraint = donor.key() == escrow.payer())]
    /// CHECK: We check that the donor provided is the escrow's payer
    donor: AccountInfo<'info>,
}

pub fn cancel_escrow(ctx: Context<CancelEscrow>) -> Result<()> {
    // check that it has funds
    match ctx.accounts.escrow.state {
        EscrowState::Funded => Ok(()),
        EscrowState::Cancelled => err!(GrantsProgramError::CancelledEscrow),
        EscrowState::Released => err!(GrantsProgramError::ReleasedEscrow),
    }?;

    // capture initial balance
    let initial_balance = ctx.accounts.donor.lamports();

    // transfer lamports
    **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= ctx.accounts.escrow.amount();
    **ctx.accounts.donor.try_borrow_mut_lamports()? += ctx.accounts.escrow.amount();
    
    // make sure it is transferred
    require_eq!(
        ctx.accounts.donor.lamports(),
        initial_balance + ctx.accounts.escrow.amount()
    );

    // update state
    ctx.accounts.escrow.state = EscrowState::Cancelled;

    Ok(())
}