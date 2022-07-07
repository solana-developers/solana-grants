use crate::state::Escrow;
use crate::state::Grant;
use crate::state::EscrowIndex;
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
        seeds = [
            b"escrow",
            grant.key().as_ref(),
            payer.key().as_ref()
        ],
        bump
    )]
    escrow: Account<'info, Escrow>,

    #[account(
        init,
        payer = payer,
        space = 8 + EscrowIndex::MAXIMUM_SPACE,
        seeds = [
            b"escrow_index", 
            grant.key().as_ref(), 
            grant.escrow_count.to_be_bytes().as_ref()
        ],
        bump
    )]
    escrow_index: Account<'info, EscrowIndex>,

    #[account(
        mut
        // constraint = grant.is_active
    )]
    grant: Account<'info, Grant>,

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
    ctx.accounts
        .escrow.set_inner(Escrow::new(
            *ctx.bumps.get("escrow").expect("we should have gotten the canonical bump"),
            ctx.accounts.payer.key(), 
            ctx.accounts.grant.key(), 
            lamports 
        ));

    // initialize index acount
    ctx.accounts
        .escrow_index
        .init(
            *ctx.bumps.get("escrow_index").unwrap(),
            ctx.accounts.escrow.key()
        );

    // update grant escrow counter
    ctx.accounts
        .grant
        .update_with_payment(&ctx.accounts.escrow.clone().into_inner());

    Ok(())
}
