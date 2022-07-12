use anchor_lang::prelude::*;

#[account]
pub struct Link {
    pub bump: u8,       // 1
    pub address: Pubkey, // 32
}

impl Link {
    pub const MAXIMUM_SPACE: usize = 1 + 32;

    pub const SEED_PREFIX: &'static str = "donation_link";
    
    pub fn new( bump: u8, address: Pubkey) -> Self {
        Link {
            bump,
            address
        }
    }

    pub fn bump(&self) -> u8 {
        self.bump
    }

    pub fn address(&self) -> Pubkey {
        self.address
    }
}
