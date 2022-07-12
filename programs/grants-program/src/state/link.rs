use anchor_lang::prelude::*;

/// This is just a linking account intended to be used as a PDA for 
/// when a different seed is needed to reach another account.
#[account]
pub struct Link {
    pub bump: u8,       // 1
    pub address: Pubkey, // 32
}

impl Link {
    pub const MAXIMUM_SPACE: usize = 1 + 32;
    
    pub fn new( bump: u8, address: Pubkey) -> Self {
        Link {
            bump,
            address
        }
    }

    pub fn bump(&self) -> u8 {
        self.bump
    }
}
