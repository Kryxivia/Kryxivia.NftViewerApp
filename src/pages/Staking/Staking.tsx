import React from "react";
import { StakingStats } from "./StakingStats";
import { StakeKxa } from "./StakeKxa";
import { StakedKxa } from "./StakedKxa";
import { FireworkRewards } from "../../components/FireworkRewards";
import { ALL_SUPPORTED_CHAIN_IDS } from "../../constants/chain";
import {accountContext} from "../../constants/context"
import {useOutletContext} from "react-router-dom";

const Staking: React.FC = () => {
    const context = useOutletContext<accountContext>();
    const chainId = context.chainId
    const accountId = context.accountId

    return (
        <div className={"app-c"}>
            <div className="notif pending" id="stake-amount">
            This program has ended since the private-access alpha has been terminated.
            </div>
          
            <h1>
                Stake your <strong>KXA</strong> now and <strong>receive NFT Rewards</strong> !
            </h1>
            <div className="intro">
                <p>You need to stake to be eligible on test-net alpha release and win an unique NFT in Kryxivia.</p>
            </div>
            <div className="p">
                <p>
                    By locking at least 15,000 KXA in this smart-contract for a fixed duration of <i>~ 1 month</i>, you will have the chance of winning an unique
                    NFT in the Kryxivia world and be selected to play the closed Alpha of Kryxivia.
                    <br />
                    <br />
                    We will select participants in the Alpha time by time with multiple batch when the servers of the Kryxivia Alpha are ready to accept more
                    players, which mean that just by staking in the contract get you the potential chance to join, we are selecting randomly and based on the
                    amount of KXA you stake: the more you decide to stake, the best chance you have to be selected.
                    <br />
                    <br />
                    As part of the Alpha test-net process, we will ask alpha players to report us bugs and issues found in-game through a google form (on-chain
                    BSC or off-chain), and we will give KXA as bounty rewards for participations.
                    <br />
                    <br />{" "}
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ⚠️ You can only stake a single time until it's unlocked, so select wisely the amount of KXA you decide to stake! ⚠️
                    </span>
                </p>
            </div>
            <h2>Discover Alpha NFT Rewards on Kryxivia !</h2>
            <FireworkRewards />
            <h2>Stake your KXA Token</h2>
            <form className="fm">
                {!accountId && chainId && <StakingStats chainId={chainId} />}
                {accountId && chainId && ALL_SUPPORTED_CHAIN_IDS.includes(chainId as number) && (
                    <>
                        <StakingStats chainId={chainId} />
                        <StakeKxa accountId={accountId} chainId={chainId} />
                        <StakedKxa accountId={accountId} chainId={chainId} />
                    </>
                )}
            </form>
            <div style={{display: 'flex', flexDirection: 'column', width:'100%', alignItems: 'center'}}>
                {!accountId && <button className="bt" disabled>Connect your wallet to stake</button>}
                <p className="p" style={{marginTop: '2rem'}}>
                 
                    <a
                        style={{ textDecoration: "underline" }}
                        href="https://github.com/solidproof/smart-contract-audits/blob/main/SmartContract_Audit_Solidproof_KryxiviaStaking.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Review Staking Contract Audit
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Staking;
