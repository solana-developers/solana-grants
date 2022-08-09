use anchor_lang::prelude::*;

/// This account holds the information of number of grants and admin

#[account]
#[derive(Default)]
pub struct ProgramInfo {
    pub bump: u8,           // 1
    pub grants_count: u32,  // 8
    pub admin: Pubkey,      // 32
}

impl ProgramInfo {
    pub const MAXIMUM_SPACE: usize = 1 + 8 + 32;

    pub const SEED: &'static str = "program_info";

    pub fn new(bump: u8, admin: Pubkey) -> Self {
        Self {
            bump,
            admin,
            ..Default::default()
        }
    }

    /// Increment the number of grants by one
    pub fn increment_grants_count(&mut self) {
        self.grants_count += 1;
    }
}