import React, { useEffect, useState } from "react";
import { CHAIN_INFO } from "../../constants/chain";
import {useOutletContext} from "react-router-dom";
import {accountContext} from "../../constants/context";
import {useNftBundleContract} from "../../hooks/useContract";
import {BigNumber, Contract} from "ethers";
import MintService from "../../services/mintService";

export const PublicAlpha = () => {
    const context = useOutletContext<accountContext>();
    const CHAIN_ID = context.chainId
    const ACCOUNT_ID = context.accountId
    // const accountId = context.accountId

    const [mintTx, setMintTx] = useState<string>();
    const [mintError, setMintError] = useState<string>();

    const resetFeedback = () => {
        setMintError("");
        setMintTx("");
    };

    async function doMint(e: any) {
        resetFeedback();
        e.preventDefault();
        const result = await MintService.claimNftAlphaAccess(CHAIN_ID, ACCOUNT_ID);
        if (result.txHash) {
            setMintTx(result.txHash);
        } else {
            setMintError(result as any);
        }
    }

    return (
        <>
            <h1>Claim your NFT for getting access to the public alpha!</h1>
            <div className="p">
                    <p>
                        To access the public alpha of Kryxivia, you need to own this exclusive NFT in your wallet, by having it, you also get access to bounty rewards.
                    </p>
            </div>
            <div className="details">
            <div className="col-md-6 justify-content-center">
            <div className="header-container">
            <span className="right">
                <img width="200" src="https://kryxsadefault.blob.core.windows.net/events/alpha-book.gif" alt="Alpha access" />
                </span>
                </div>
            </div>
            </div>
            {ACCOUNT_ID && 
                <button className={"bt bt-p"} onClick={(e) => doMint(e)}>
                    <span>Mint my NFT</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 296.473 296.473">
                        <path d="M292.676 114.759l-1.827-7.104a147.15 147.15 0 0 0-6.026-17.118l-2.968-6.566-1.6-3.219C255.7 32.811 205.8 0 148.237 0h-.001-.001C90.673 0 40.772 32.811 16.218 80.751l-1.6 3.219c-1.561 3.24-3.008 6.546-4.335 9.912a146.99 146.99 0 0 0-4.659 13.772c-.666 2.346-1.275 4.714-1.827 7.104C1.314 125.517.001 136.723.001 148.236s1.313 22.719 3.796 33.478c.552 2.391 1.161 4.759 1.827 7.104 1.332 4.689 2.89 9.285 4.659 13.773 1.327 3.366 2.774 6.672 4.335 9.912l1.6 3.219c24.555 47.94 74.455 80.751 132.018 80.751h.001.001c57.563 0 107.463-32.81 132.018-80.751l1.6-3.219c1.041-2.16 2.03-4.35 2.968-6.566 2.345-5.542 4.361-11.256 6.026-17.118.666-2.346 1.275-4.714 1.827-7.104 2.483-10.759 3.796-21.965 3.796-33.478s-1.314-22.719-3.797-33.478zm-77.94 33.477l-66.5 87.334-66.5-87.334 66.5-87.334 66.5 87.334z" />
                    </svg>
                </button>
            }
             {mintError && (
                    <div className="notif danger">
                        <span>{JSON.parse(mintError).errorMessage}</span>
                    </div>
                )}
            {mintTx && CHAIN_ID && (
                    <div className="notif success">
                        Minted successfully !{" "}
                        <a style={{ textDecoration: "underline" }} href={`${CHAIN_INFO[CHAIN_ID].explorer}tx/${mintTx}`} target="_blank" rel="noreferrer">
                            View on BSCScan
                        </a>
                    </div>
                )}
        </>
    );
};

export default PublicAlpha
