import {PublicKey} from "@solana/web3.js";

export interface ProgramInfoModel {
    bump?: number,
    grantsCount?: number,
    admin?: PublicKey,
}
