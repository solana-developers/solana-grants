import {PublicKey} from "@solana/web3.js";

export interface GrantModel {
    author?: PublicKey,
    escrowCount?: number,
    info?: String,
    lamportsRaised?: number,
    totalDonors?: number,
    targetLamports?: number,
    dueDate?: number,
    isActive?: boolean,
    matchingEligible?: boolean,
    grantNum?: number,
}
