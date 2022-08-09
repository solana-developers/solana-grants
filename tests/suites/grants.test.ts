import * as anchor from "@project-serum/anchor";
import {AnchorError, BN, Program} from "@project-serum/anchor";
import {GrantsProgram} from "../../target/types/grants_program";
import {Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey, Keypair, SendTransactionError} from "@solana/web3.js";
import {encode} from "@project-serum/anchor/dist/cjs/utils/bytes/utf8";
import {assert, expect} from "chai";
import { toBytesInt32 } from "../../app/src/utils/conversion";

export default function suite() {
    
    // initialize in `before` from the context
    let program: Program<GrantsProgram>;
    let admin: Keypair;
    let programInfoPDA: PublicKey;
    let generateFundedKeypair: () => Promise<Keypair>;


    // create new for every test in `beforeEach`
    let grantPDA: PublicKey;
    let author: Keypair;

    before( function() {
        program = this.test.ctx.program;
        programInfoPDA = this.test.ctx.programInfoPDA;
        admin = this.test.ctx.admin;
        generateFundedKeypair = this.test.ctx.generateFundedKeypair;
    })

    // runs before each test, updates the grant PDA and author keypair
    beforeEach(async () => {
        const programInfo = await program.account.programInfo.fetch(programInfoPDA)

        const [newGrantPDA, grant_bump] = await anchor.web3.PublicKey.findProgramAddress(
            [
                encode("grant"),
                toBytesInt32(programInfo.grantsCount),
            ],
            program.programId
        );

        grantPDA = newGrantPDA;

        author = await generateFundedKeypair();
    });

    async function createGrant(author: Keypair) {

        const targetLamports = new BN(LAMPORTS_PER_SOL);
        const dueDate = new BN(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
        const info = "";

        await program.methods
            .createGrant(info, targetLamports, dueDate)
            .accounts({
                grant: grantPDA,
                programInfo: programInfoPDA,
                author: author.publicKey,
            })
            .signers([author])
            .rpc();

        return program.account.grant.fetch(grantPDA);
    } 

    it("Creates a grant", async () => {

        const targetLamports = new BN(LAMPORTS_PER_SOL);
        // const dueDate = 123124;

        const grant = await createGrant(author);

        // TODO: Check for due date
        // expect(grant.dueDate).to.eql(dueDate);
        expect(grant.author).to.eql(author.publicKey);
        expect(grant.lamportsRaised.toNumber()).to.eql(0);
        expect(grant.totalDonors).to.eql(0);
        assert(grant.targetLamports.eq(targetLamports));
        expect(grant.state).to.eql({ active: {} });
        expect(grant.info).to.eql("")
    })

    it("Is updating the number of grants", async () => {

        await createGrant(author);

        const grantsCount = (await program.account.programInfo.fetch(programInfoPDA)).grantsCount;
        expect(grantsCount).to.eql(2)

    })

    it("admin can cancel the grant", async () => {

        const programInfo = await program.account.programInfo.fetch(programInfoPDA)

        await createGrant(author);

        await program.methods
            .cancelGrantAdmin()
            .accounts({
                grant: grantPDA,
                admin: programInfo.admin,
                programInfo: programInfoPDA,
            })
            .signers([admin])
            .rpc();

        const grant = await program.account.grant.fetch(grantPDA)

        expect(grant.state).to.eql({ cancelled: {} })
    })

    it("author can cancel the grant", async () => {
        await createGrant(author);

        await program.methods
            .cancelGrantAuthor()
            .accounts({
                grant: grantPDA,
                author: author.publicKey,
            })
            .signers([author])
            .rpc();

        const grant = await program.account.grant.fetch(grantPDA)

        expect(grant.state).to.eql({ cancelled: {} })
    })

    it("admin can make grant eligible matching", async () => {

        const programInfo = await program.account.programInfo.fetch(programInfoPDA)

        await createGrant(author);

        await program.methods
            .eligibleMatching()
            .accounts({
                grant: grantPDA,
                admin: programInfo.admin,
                programInfo: programInfoPDA,
            })
            .signers([admin])
            .rpc();

        const grant = await program.account.grant.fetch(grantPDA)

        expect(grant.isMatchingEligible).to.eql(true)
    })

    it("author cannot make grant eligible matching", async () => {

        await createGrant(author);

        try {
            await program.methods
                .eligibleMatching()
                .accounts({
                    grant: grantPDA,
                    admin: author.publicKey,
                    programInfo: programInfoPDA,
                })
                .signers([author])
                .rpc();
            
            expect.fail("Author can make grant eligible matching, but it should not be allowed");
        } catch (e) {
            expect(e).to.be.instanceOf(AnchorError);
            const err: AnchorError = e;
            expect(err.error.errorCode.code).to.equal("ConstraintHasOne");
            expect(err.error.errorCode.number).to.equal(2001);
            expect(err.program.equals(program.programId)).is.true;
        }
    });
}
