
use anchor_lang::prelude::*;

#[error_code]
pub enum GrantsProgramError {
    #[msg("This donation has already refunded the payer")]
    CancelledDonation,

    #[msg("This grant has already transferred the funds to the receiver")]
    ReleasedGrant,

    #[msg("This grant is cancelled")]
    CancelledGrant,
    
}
