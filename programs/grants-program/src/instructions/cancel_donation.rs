use anchor_lang::prelude::*;

use crate::{
    errors::{DonationError, GrantError},
    state::{Donation, DonationState, FundingState, Grant, ProgramInfo},
};

#[derive(Accounts)]
pub struct CancelDonation<'info> {
    admin: Signer<'info>,

    #[account(has_one = admin, seeds = [ProgramInfo::SEED.as_bytes().as_ref()], bump = program_info.bump)]
    program_info: Account<'info, ProgramInfo>,

    #[account(
        mut,
        has_one = payer,
        has_one = grant,
    )]
    /// CHECK: We don't check for the seeds because they can be normal donations
    ///        or a matching donation, which have different seed formats.
    donation: Account<'info, Donation>,

    #[account(mut)]
    /// CHECK: We check that the donation has this payer
    payer: AccountInfo<'info>,

    #[account(
        mut,
        seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
        bump = grant.bump,
    )]
    /// CHECK: We check that the donation has this grant
    grant: Account<'info, Grant>,
}

/// Refunds the money from the grant to the payer
pub fn cancel_donation(ctx: Context<CancelDonation>) -> Result<()> {
    // check if it is cancellable
    match ctx.accounts.donation.state {
        DonationState::Funded => Ok(()),
        DonationState::Cancelled => err!(DonationError::CancelledDonation),
    }?;

    // check that the grant is on a cancelled state
    match ctx.accounts.grant.funding_state {
        FundingState::Cancelled => Ok(()),
        FundingState::Active => err!(GrantError::GrantStillActive),
        FundingState::Released => err!(GrantError::ReleasedGrant),
    }?;

    // transfer lamports from the grant to the payer
    let lamports = ctx.accounts.donation.amount();
    **ctx
        .accounts
        .grant
        .to_account_info()
        .try_borrow_mut_lamports()? -= lamports;
    **ctx.accounts.payer.try_borrow_mut_lamports()? += lamports;

    // update donation state
    ctx.accounts.donation.state = DonationState::Cancelled;

    Ok(())
}
