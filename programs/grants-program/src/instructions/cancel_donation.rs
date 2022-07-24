use anchor_lang::prelude::*;

use crate::{state::{Donation, ProgramInfo, DonationState}, errors::DonationError};

#[derive(Accounts)]
pub struct CancelDonation<'info> {
    admin: Signer<'info>,

    #[account(has_one = admin, seeds = [b"program_info"], bump = program_info.bump)]
    program_info: Account<'info, ProgramInfo>,

    #[account(
        mut,
        has_one = payer,
        has_one = grant,
        seeds = [
            Donation::SEED_PREFIX.as_bytes().as_ref(),
            donation.grant.as_ref(), 
            donation.payer.as_ref()
        ],
        bump = donation.bump()
    )]
    donation: Account<'info, Donation>,

    #[account(mut)]
    /// CHECK: We check that the donation has this payer
    payer: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK: We check that the donation has this grant
    grant: AccountInfo<'info>,
}

/// Refunds the money from the grant to the payer
pub fn cancel_donation(ctx: Context<CancelDonation>) -> Result<()> {

    // check if it is cancellable
    match ctx.accounts.donation.state {
        DonationState::Funded => Ok(()),
        DonationState::Cancelled => err!(DonationError::CancelledDonation),
    }?;

    // transfer lamports from the grant to the payer
    **ctx
        .accounts
        .grant
        .to_account_info()
        .try_borrow_mut_lamports()? -= ctx.accounts.donation.amount();
    **ctx.accounts.payer.try_borrow_mut_lamports()? += ctx.accounts.donation.amount();

    // update donation state
    ctx.accounts.donation.state = DonationState::Cancelled;

    Ok(())
}
