
use anchor_lang::{prelude::*, solana_program::{program::invoke, system_instruction}};

use crate::{state::{Donation, Grant, ProgramInfo}, errors::DonationError};

#[derive(Accounts)]
pub struct IncrementDonation<'info> {
    #[account(
        mut, 
        has_one = payer,
        has_one = grant,
        seeds = [
            Donation::SEED_PREFIX.as_ref(), 
            donation.grant.as_ref(), 
            donation.payer.as_ref()
        ],
        bump = donation.bump()
    )]
    donation: Account<'info, Donation>,

    #[account(mut)]
    /// CHECK: We check that the donation has this payer
    payer: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"matching_donation", grant.key().as_ref()],
        bump,
    )]
    matching_donation: Account<'info, Donation>,

    #[account(mut, seeds = [ProgramInfo::SEED.as_bytes().as_ref()], bump = program_info.bump)]
    program_info: Account<'info, ProgramInfo>,

    #[account(
        mut,
        seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
        bump = grant.bump,
    )]
    /// CHECK: We check that the donation has this grant
    grant: Account<'info, Grant>,

    system_program: Program<'info, System>,
}

/// Transfers the lamports from the payer to the grant
/// on an existing donation, and increments the match.
/// 
/// Returns true if the donation was matched, false otherwise.
pub fn increment_donation(ctx: Context<IncrementDonation>, lamports: u64) -> Result<()> {
    // check that the grant is still Active
    ctx.accounts.grant.is_active()?;

    // transfer lamports from payer to grant
    invoke(
        &system_instruction::transfer(
            &ctx.accounts.payer.key(),
            &ctx.accounts.grant.key(),
            lamports
        ), 
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.grant.to_account_info(),
        ]
    )?;

    let previously_matched_amount = ctx.accounts.donation.matching_amount();
    
    // update donation
    ctx.accounts.donation.amount += lamports;

    // make matching donation
    if !ctx.accounts.grant.is_matching_eligible {
        // not eligible for matching
        return err!(DonationError::NotMatchingEligible);
    }

    // increment the matched amount
    let matched_diff = ctx.accounts.donation.matching_amount() - previously_matched_amount;
    
    let program_info = ctx.accounts.program_info.to_account_info();

    let new_program_info_balance = 
        program_info
            .try_borrow_lamports()?
            .checked_sub(matched_diff)
            .ok_or(DonationError::InsufficientFunds)?;

    **program_info.try_borrow_mut_lamports()? = new_program_info_balance;
    **ctx.accounts.grant.to_account_info().try_borrow_mut_lamports()? += matched_diff;

    // update matching donation
    ctx.accounts.matching_donation.amount += matched_diff;

    Ok(())
}
