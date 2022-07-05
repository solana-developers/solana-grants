use crate::state::Escrow;
use crate::state::Grant;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        init, 
        payer = payer, 
        space = 8 + Escrow::MAXIMUM_SPACE,
        seeds = [b"escrow", receiver.key().as_ref(), payer.key().as_ref()],
        bump
    )]
    escrow: Account<'info, Escrow>,

    // #[account(
        // constraint = grant.is_active
    // )]
    receiver: Account<'info, Grant>,

    system_program: Program<'info, System>,
}

pub fn create_escrow(ctx: Context<CreateEscrow>, lamports: u64) -> Result<()> {

    // transfer lamports
    invoke(
        &system_instruction::transfer(
            &ctx.accounts.payer.key(),
            &ctx.accounts.escrow.key(),
            lamports
        ), 
        &[
            ctx.accounts.payer.to_account_info(),
            ctx.accounts.escrow.to_account_info(),
        ]
    )?;

    // initialize escrow
    let &bump = ctx.bumps.get("escrow").expect("we should have gotten the canonical bump");
    ctx.accounts
        .escrow
        .init(ctx.accounts.payer.key(), ctx.accounts.receiver.key(), lamports, bump);

    Ok(())
}
