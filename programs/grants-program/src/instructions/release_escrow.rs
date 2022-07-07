use anchor_lang::prelude::*;

use crate::{state::{Escrow, EscrowState}, errors::GrantsProgramError};

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.receiver().key().as_ref(), escrow.payer().as_ref()],
        bump = escrow.bump(),
    )] 
    escrow: Account<'info, Escrow>,

    #[account(mut, address = escrow.receiver())]
    /// CHECK: We check a custom constraint to make sure it is the escrow's receiver
    receiver: AccountInfo<'info>,
}

pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
    
    // check that it has funds
    match ctx.accounts.escrow.state {
        EscrowState::Funded => Ok(()),
        EscrowState::Cancelled => err!(GrantsProgramError::CancelledEscrow),
        EscrowState::Released => err!(GrantsProgramError::ReleasedEscrow),
    }?;

    // TODO: check that it is releasable

    // transfer lamports
    **ctx.accounts.escrow
        .to_account_info().try_borrow_mut_lamports()? -= ctx.accounts.escrow.amount();
    **ctx.accounts.receiver.try_borrow_mut_lamports()? += ctx.accounts.escrow.amount();

    // update state
    ctx.accounts.escrow.state = EscrowState::Released;

    Ok(())
}
