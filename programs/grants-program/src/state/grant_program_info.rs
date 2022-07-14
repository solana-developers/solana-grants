use anchor_lang::prelude::*;

/// This account holds the information of number of grants and admin

#[account]
#[derive(Default)]
pub struct GrantsProgramInfo {
    pub bump: u8,           // 1
    pub grants_count: u32,  // 8
    pub admin: Pubkey,      // 32
}

impl GrantsProgramInfo {
    pub const MAXIMUM_SPACE: usize = 1 + 8 + 32;

    pub fn new(bump: u8, admin: Pubkey, grants_count: u32) -> Self {
        GrantsProgramInfo {
            bump,
            grants_count,
            admin,
        }
    }

    pub fn bump(&self) -> u8 {
        self.bump
    }

    pub fn grants_count(&self) -> u32 {
        self.grants_count
    }

    pub fn admin(&self) -> Pubkey {
        self.admin
    }

    /// Increment the number of grants by one
    pub fn increment_grants_count(&mut self) {
        self.grants_count += 1;
    }
}