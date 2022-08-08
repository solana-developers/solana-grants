use crate::state::Donation;
use crate::state::Grant;
use crate::state::Link;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;

#[derive(Accounts)]
pub struct CreateDonation<'info> {

    #[account(mut)]
    payer: Signer<'info>,
    
    #[account(mut)]
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

    system_program: Program<'info, System>,
}

pub fn create_donation(ctx: Context<CreateDonation>, lamports: u64) -> Result<()> {

    // Make sure the grant is still active
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

    Ok(())
}
