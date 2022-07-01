
use anchor_lang::prelude::*;

#[error_code]
pub enum GrantsProgramError {
    #[msg("This escrow has been cancelled")]
    CancelledEscrow,

    #[msg("This escrow has already transferred the funds to the receiver")]
    ReleasedEscrow,
    
}