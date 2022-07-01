use crate::state::Escrow;
use crate::state::Grant;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    donor: Signer<'info>,

    #[account(
        init, 
        payer = donor, 
        space = 8 + Escrow::MAXIMUM_SPACE,
        seeds = [b"escrow", grant.key().as_ref(), donor.key().as_ref()],
        bump
    )]
    escrow: Account<'info, Escrow>,

    // #[account(
        // constraint = grant.is_active
    // )]
    grant: Account<'info, Grant>,

    system_program: Program<'info, System>,
}

pub fn create_escrow(ctx: Context<CreateEscrow>, lamports: u64) -> Result<()> {

    let initial_balance = ctx.accounts.escrow.to_account_info().lamports();

    // transfer lamports
    invoke(
        &system_instruction::transfer(
            &ctx.accounts.donor.key(),
            &ctx.accounts.escrow.key(),
            lamports
        ), 
        &[
            ctx.accounts.donor.to_account_info(),
            ctx.accounts.escrow.to_account_info(),
        ]
    )?;

    require_eq!(
        ctx.accounts.escrow.to_account_info().lamports(),
        initial_balance + lamports
    );

    // initialize escrow
    let &bump = ctx.bumps.get("escrow").expect("we should have gotten the canonical bump");
    ctx.accounts
        .escrow
        .init(ctx.accounts.donor.key(), ctx.accounts.grant.key(), lamports, bump);

    Ok(())
}
