
use anchor_lang::prelude::*;

#[error_code]
pub enum GrantsProgramError {
    #[msg("This escrow has already refunded the payer")]
    CancelledEscrow,

    #[msg("This escrow has already transferred the funds to the receiver")]
    ReleasedEscrow,
    
}