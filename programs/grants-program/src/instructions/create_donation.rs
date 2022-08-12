use crate::errors::DonationError;
use crate::state::Donation;
use crate::state::Grant;
use crate::state::Link;
use crate::state::ProgramInfo;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;

#[derive(Accounts)]
pub struct CreateDonation<'info> {

    #[account(mut)]
    payer: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
        bump = grant.bump,
    )]
    grant: Account<'info, Grant>,

    #[account(
        init, 
        payer = payer, 
        space = 8 + Donation::MAXIMUM_SPACE,
        seeds = [
            Donation::SEED_PREFIX.as_bytes().as_ref(),
            grant.key().as_ref(),
            payer.key().as_ref()
        ],
        bump
    )]
    donation: Account<'info, Donation>,

    #[account(
        init,
        payer = payer,
        space = 8 + Link::MAXIMUM_SPACE,
        seeds = [
            b"donation_index", 
            grant.key().as_ref(), 
            grant.total_donors.to_be_bytes().as_ref()
        ],
        bump
    )]
    donation_index: Account<'info, Link>,

    #[account(
        mut,
        seeds = [b"matching_donation", grant.key().as_ref()],
        bump,
    )]
    matching_donation: Account<'info, Donation>,

    #[account(mut, seeds = [ProgramInfo::SEED.as_bytes().as_ref()], bump = program_info.bump)]
    program_info: Account<'info, ProgramInfo>,

    system_program: Program<'info, System>,
}

/// Transfers the lamports from the payer to the grant, 
/// and increments the match.
/// 
/// Returns true if the donation was matched, false otherwise.
pub fn create_donation(ctx: Context<CreateDonation>, lamports: u64) -> Result<()> {

    // Make sure the grant is still active
    ctx.accounts.grant.is_active()?;

    if !ctx.accounts.grant.is_matching_eligible {
        // not eligible for matching
        return err!(DonationError::NotMatchingEligible)
    }

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

    // initialize donation account
    let donation = Donation::new(
            *ctx.bumps.get(Donation::SEED_PREFIX).expect("we should have gotten the donation's canonical bump"),
            ctx.accounts.payer.key(), 
            ctx.accounts.grant.key(), 
            lamports,
        );
    ctx.accounts
        .donation.set_inner(donation.clone());

    // initialize index account
    ctx.accounts
        .donation_index
        .set_inner(
            Link::new(
            *ctx.bumps.get("donation_index").expect("we should have gotten the donation index's canonical bump"),
            ctx.accounts.donation.key()
            )
        );

    // update grant data
    ctx.accounts
        .grant
        .update_with_new_donation(&donation);

    // make matching donation
    let matching = donation.matching_amount();
    
    let program_info = ctx.accounts.program_info.to_account_info();

    let new_program_info_balance = 
        program_info
            .try_borrow_lamports()?
            .checked_sub(matching)
            .ok_or(DonationError::InsufficientFunds)?;

    **program_info.try_borrow_mut_lamports()? = new_program_info_balance;
    **ctx.accounts.grant.to_account_info().try_borrow_mut_lamports()? += matching;

    // update matching donation
    ctx.accounts.matching_donation.amount += matching;

    Ok(())
}
