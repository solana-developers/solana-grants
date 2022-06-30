use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod grants_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}


#[account]
pub struct GrantInfo {
    pub total_amount: u32,
    pub data: String, // This would be an identifier to data stored on our web3 DB
    pub amount_raised: u32,
    pub wallet_address: Pubkey,
    pub total_donors: u32,
    pub matching_eligible: bool
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const NUMBER_LENGTH: usize = 4;
const CHAR_LENGTH: usize = 4;
const DATA_LENGTH: usize = 200 * CHAR_LENGTH; // A string of 200 chars maximum
const BOOLEAN_LENGTH: usize = 1;

impl GrantInfo {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + NUMBER_LENGTH // total_amount
        + DATA_LENGTH // data
        + NUMBER_LENGTH // amount_raised
        + PUBLIC_KEY_LENGTH // wallet_address.
        + NUMBER_LENGTH // total_donors
        + BOOLEAN_LENGTH; // matching_eligible
}