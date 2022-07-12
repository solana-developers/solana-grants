use anchor_lang::prelude::*;

/// This account holds the information of number of grants and admin

#[account]
#[derive(Default)]
pub struct ProgramInfo {
    pub bump: u8,           // 1
    pub grants_count: u32,  // 8
    pub authority: Pubkey,        // 32
}

impl ProgramInfo {
    pub const MAXIMUM_SPACE: usize = 1 + 8 + 32;

    pub const SEED_PREFIX: &'static str = "program_info";

    pub fn new(bump: u8, authority: Pubkey, grants_count: u32) -> Self {
        ProgramInfo {
            bump,
            grants_count,
            authority: authority,
        }
    }

    pub fn bump(&self) -> u8 {
        self.bump
    }

    pub fn grants_count(&self) -> u32 {
        self.grants_count
    }

    pub fn authority(&self) -> Pubkey {
        self.authority
    }

    /// Increment the number of grants by one
    pub fn increment_grants_count(&mut self) {
        self.grants_count += 1;
    }
} 