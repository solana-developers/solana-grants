import {PublicKey} from "@solana/web3.js";

/**
 * Converts public key to a string representation and
 * returns public key in this format `EgG3...rWbXi`
 */

export default function DisplayPublicKey(publicKey: PublicKey): string {
    const pubKey = publicKey.toBase58();
    return pubKey.slice(0, 4) + '...' + pubKey.slice(-4);
}