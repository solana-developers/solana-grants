use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction},
};

use crate::{state::{Escrow, EscrowState}, errors::GrantsProgramError};

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", grant.key().as_ref(), escrow.payer().as_ref()],
        bump = escrow.bump(),
    )] 
    escrow: Account<'info, Escrow>,

    #[account(mut, constraint = grant.key() == escrow.receiver())]
    /// CHECK: We check a custom constraint to make sure it is the escrow's receiver
    grant: AccountInfo<'info>,
}

pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
    
    // check that it has funds
    match ctx.accounts.escrow.state {
        EscrowState::Funded => Ok(()),
        EscrowState::Cancelled => err!(GrantsProgramError::CancelledEscrow),
        EscrowState::Released => err!(GrantsProgramError::ReleasedEscrow),
    }?;

    // capture initial balance
    let initial_balance = ctx.accounts.grant.lamports();

    // transfer lamports
    **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= ctx.accounts.escrow.amount();
    **ctx.accounts.grant.try_borrow_mut_lamports()? += ctx.accounts.escrow.amount();
    
    // make sure it is transferred
    require_eq!(
        ctx.accounts.grant.lamports(),
        initial_balance + ctx.accounts.escrow.amount()
    );

    // update state
    ctx.accounts.escrow.state = EscrowState::Released;

    Ok(())
}
