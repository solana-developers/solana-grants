use anchor_lang::prelude::*;

#[error_code]
pub enum GrantError {
    #[msg("The provided info string should be 200 characters long maximum.")]
    InfoTooLong,

    #[msg("The provided date is not in the correct format.")]
    InvalidDateFormat,

    #[msg("This grant has already transferred the funds to the receiver")]
    ReleasedGrant,

    #[msg("This grant has already been cancelled")]
    CancelledGrant,

    #[msg("This grant is still active")]
    GrantStillActive,
}
