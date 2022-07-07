use anchor_lang::prelude::*;
use crate::state::{Grant, InitGrant};

#[derive(Accounts)]
pub struct CreateGrant<'info> {
  #[account(
    init, 
    payer = creator, 
    space = 8 + Grant::MAXIMUM_SPACE,
    seeds = [b"grant", creator.key().as_ref()],
    bump
  )]
  grant: Account<'info, Grant>,

  #[account(mut)]
  creator: Signer<'info>,

  system_program: Program<'info, System>,
}

pub fn create_grant(ctx: Context<CreateGrant>, grant_info: InitGrant ) -> Result<()>{
  ctx.accounts.grant.init(grant_info);
  Ok(())
}