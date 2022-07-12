
use anchor_lang::{prelude::*, solana_program::{program::invoke, system_instruction}};

use crate::state::{Donation, Grant};

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

    #[account(mut)]
    /// CHECK: We check that the donation has this receiver
    grant: Account<'info, Grant>,

    system_program: Program<'info, System>,
}

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

    // update donation
    ctx.accounts.donation.amount += lamports;

    Ok(())
}
