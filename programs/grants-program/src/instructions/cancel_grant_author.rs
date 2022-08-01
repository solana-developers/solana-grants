use crate::state::Grant;
use anchor_lang::prelude::*;

/// Lets an author cancel a grant.
#[derive(Accounts)]
pub struct CancelGrantAuthor<'info> {
    author: Signer<'info>,

    #[account(
        mut,
        seeds = [b"grant", grant.grant_num.to_be_bytes().as_ref()],
        bump = grant.bump,
        has_one = author
    )]
    grant: Account<'info, Grant>,
}

pub fn cancel_grant_author(ctx: Context<CancelGrantAuthor>) -> Result<()> {
    // checking if grant is inactive
    if ctx.accounts.grant.is_cancelled == true {
        return Err(GrantErrors::AlreadyInActive.into());
    }

    // cancelling grant
    ctx.accounts.grant.cancel_grant();

    Ok(())
}
