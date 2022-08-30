use anchor_lang::{prelude::*, solana_program::sysvar::rent};

use crate::{state::{ProgramInfo, Grant, FundingState}, errors::GrantError};

#[derive(Accounts)]
pub struct ReleaseGrant<'info> {
    admin: Signer<'info>,

    #[account(
        has_one = admin, 
        seeds = [ProgramInfo::SEED.as_bytes().as_ref()],
        bump = program_info.bump,
    )]
    program_info: Account<'info, ProgramInfo>,

    #[account(
        mut,
        has_one = author,
        seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
        bump = grant.bump,
    )]
    grant: Account<'info, Grant>,

    #[account(mut)]
    /// CHECK: We check that the grant has this author
    author: AccountInfo<'info>,
}

pub fn release_grant(ctx: Context<ReleaseGrant>) -> Result<()> {
    // Check that it is releasable
    match ctx.accounts.grant.funding_state {
            FundingState::Active => Ok(()),
            FundingState::Released => err!(GrantError::ReleasedGrant),
            FundingState::Cancelled => err!(GrantError::CancelledGrant),
    }?;

    // transfer lamports from grant to creator, keep enough for rent
    let balance = ctx.accounts.grant
        .to_account_info().try_borrow_lamports()?.clone() - Rent::get()?.minimum_balance( 8 + Grant::MAXIMUM_SPACE);

    **ctx.accounts.grant
        .to_account_info().try_borrow_mut_lamports()? -= balance;

    **ctx.accounts.author.try_borrow_mut_lamports()? += balance;

    // update grant state
    ctx.accounts.grant.funding_state = FundingState::Released;

    Ok(())
}
