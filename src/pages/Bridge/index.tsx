import React, { useEffect, useState } from "react";
import { CHAIN_INFO } from "../../constants/chain";
import {useOutletContext} from "react-router-dom";
import {accountContext} from "../../constants/context";
import {useBridgeInContract, useBridgeOutContract, useNftBundleContract} from "../../hooks/useContract";
import {BigNumber, Contract} from "ethers";
import MintService from "../../services/mintService";
import { ReactComponent as MetamaskIcon } from "../../assets/img/metamask.svg";
import { ReactComponent as BnbIcon } from "../../assets/img/bnb.svg";
import { ReactComponent as EthereumIcon } from "../../assets/img/ethereum.svg";
import { TokenBalance } from "../../components/TokenBalance";
import { useStakingContract, useTokenContract } from "../../hooks/useContract";
import { formatUnits } from "@ethersproject/units";
import { utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

export const Bridge = () => {
    const { library } = useWeb3React();
    const context = useOutletContext<accountContext>();
    const CHAIN_ID = context.chainId
    const ACCOUNT_ID = context.accountId
    // const accountId = context.accountId
    const tokenContract = useTokenContract(CHAIN_INFO[CHAIN_ID].tokenAddress);
    const bridgeInContract = useBridgeInContract(CHAIN_INFO[CHAIN_ID].bridgeInContract)
    const bridgeOutContract = useBridgeOutContract(CHAIN_INFO[CHAIN_ID].bridgeOutContract)

    function useCurrentBalance(chainId: number) {
        const [amount, setAmount] = useState("");
    
        useEffect(() => {
            const fetchData = async () => {
                if (tokenContract === null) { return; }
                const result = await tokenContract.balanceOf(ACCOUNT_ID);
                setAmount(parseFloat(formatUnits(result, 18)).toFixed());
                setamountToBridge(parseFloat(formatUnits(result, 18)).toFixed())
            };
    
            fetchData();
        }, [setAmount, tokenContract]);
    
        return amount;
    }

    function useCurrentToClaim(chainId: number) {
        const [amount, setAmount] = useState("");
    
        useEffect(() => {
            const fetchData = async () => {
                if (chainId != 1) { return; }
                if (tokenContract === null) { return; }
                const addrInfo = await bridgeOutContract.getAddressInfos(ACCOUNT_ID)

                const total = parseFloat(formatUnits(addrInfo[0], 18))
                const alreadyClaimed = parseFloat(formatUnits(addrInfo[1], 18))
                const leftToClaim = total - alreadyClaimed;

                setAmount(leftToClaim.toFixed())
                setAmountToClaim(leftToClaim.toFixed())
                setTotalClaimed(alreadyClaimed.toFixed())
                setTotalBridged(total.toFixed())
            };
            fetchData()
            const interval = setInterval(() => { fetchData() }, 60*1000);
            return () => {
                clearInterval(interval);
            };
        }, [setAmount, tokenContract]);
        return amount;
    }

    const [amountToBridge, setamountToBridge] = useState<string>("");
    const [amountToClaim, setAmountToClaim] = useState<string>("0");
    const [totalClaimed, setTotalClaimed] = useState<string>("0");
    const [totalBridged, setTotalBridged] = useState<string>("0");
    const [stakeTx, setStakeTx] = useState<string>();
    const [error, setError] = useState<string>();
    const [pending, setPending] = useState<string>();
    const [success, setSuccess] = useState<string>();
    const currentBalance = useCurrentBalance(CHAIN_ID)
    const currentToClaim = useCurrentToClaim(CHAIN_ID)

    const resetFeedback = () => {
        setError("");
        setPending("");
        setSuccess("");
    };
    
    async function bridgeInBNB(e: any) {
        e.preventDefault();
        resetFeedback();
        if (bridgeInContract == null || tokenContract == null || amountToBridge === "") {
            setError("Enter an amount to bridge");
            return;
        }
        const asNumber: number = parseFloat(amountToBridge);
        if (asNumber <= Number(0)) {
            setError(`Invalid amount the bridge amount needs to be superior than 0 KXA`);
            return;
        }
        const decimalAmount: any = utils.parseEther(amountToBridge);
        try {
            /**Approve contract */
            const allowance = await tokenContract.allowance(ACCOUNT_ID, CHAIN_INFO[CHAIN_ID].bridgeInContract);
            if (parseFloat(allowance) < parseFloat(decimalAmount)) {
                setPending("Allowance pending, please allow the use of your token balance for the contract...");
                const approveTx = await tokenContract.approve(CHAIN_INFO[CHAIN_ID].bridgeInContract, decimalAmount.toString());
                setPending("Waiting for 2 confirmations ...");
                await library.waitForTransaction(approveTx.hash, 2);
                setPending("Allowance successfully increased, waiting for bridge transaction...");
                resetFeedback();
            }

            setPending("Pending: check your wallet extension to execute the chain transaction ...");
            const result = await bridgeInContract.bridgeKxa(decimalAmount.toString());
            setPending("Waiting for 2 confirmations...");
            const txReceipt = await library.waitForTransaction(result.hash, 2);
            if (txReceipt.status === 1) {
                resetFeedback();
                setSuccess(`Transaction successfully sent to the bridge contract over the BNB Network, now please switch your Metamask to the Ethereum network and wait ~30 minutes.`);
                setStakeTx(`${txReceipt.transactionHash}`);
            }
        } catch (e: any) {
            resetFeedback();
            if (e && e?.data?.message !== undefined) {
                setError(`${e.data.message}`);
            } else if (e && e.message) {
                setError(`${e.message}`);
            } else {
                setError(`Error: ${e}`);
            }
        }
    }

    async function claimKXA(e: any)
    {
        e.preventDefault();
        resetFeedback();
        try {
            const result = await bridgeOutContract.withdrawBridged()
            setPending("Waiting for 2 confirmations...");
            const txReceipt = await library.waitForTransaction(result.hash, 2);
            if (txReceipt.status === 1) {
                const addrInfo = await bridgeOutContract.getAddressInfos(ACCOUNT_ID)
                resetFeedback();
                setSuccess(`Transaction successfully sent! You did claimed in total ${parseFloat(formatUnits(addrInfo[1], 18))} KXA`);
                setStakeTx(`${txReceipt.transactionHash}`);
            }
        } catch (e: any) {
            resetFeedback();
            if (e && e?.data?.message !== undefined) {
                setError(`${e.data.message}`);
            } else if (e && e.message) {
                setError(`${e.message}`);
            } else {
                setError(`Error: ${e}`);
            }
        }
    }

    async function updateBalance()
    {
        const result = await tokenContract.balanceOf(ACCOUNT_ID);
        setamountToBridge(parseFloat(formatUnits(result, 18)).toFixed())
    }


    return (
        <>
            <h1>Bridge your KXA tokens from BNB Network to ETH Network</h1>
            <div className="p">
                    <p>
                        You first need to deposit your KXA by switching to <BnbIcon width={20}/> BNB Network over Metamask <MetamaskIcon width={20}/> and then switch to <EthereumIcon width={20} height={20}/> ETH network to claim back your tokens. 
                    </p>
            </div>
            <div className="details">
            <div className="col-md-6 justify-content-center">
            <div className="header-container">
            <form className="fm">

        {CHAIN_ID == 56 && 
        <fieldset className="stk">
            <legend>Switching your KXA from BNB to Ethereum network</legend>
            {
                <div className="ins">
                    <div className="in inm">
                        <label htmlFor="stake-amount">
                            Amount to bridge <small></small>
                        </label>
                        <input
                            type="number"
                            name="stake-amount"
                            min={0}
                            defaultValue={currentBalance}
                            value={amountToBridge}
                            onChange={(e) => {
                                setamountToBridge(e.target.value);
                            }}
                            aria-invalid={!!amountToBridge}
                            aria-describedby="stake-amount"
                        />
                    </div>
                    <div className="in inx">
                        <div className="btm">
                            <button className="bt bt-p" onClick={(e) => bridgeInBNB(e)}>
                                <span>Bridge to ETH</span>
                                <BnbIcon />
                            </button>
                        </div>
                    </div>
                    <a onClick={() => { updateBalance() } } style={{color:"#e0fbfc"}}href="#">Max.</a>
                </div>
            }
            {error && (
                <div className="notif danger" id="stake-amount">
                    {error}
                </div>
            )}
            {pending && (
                <div className="notif pending" id="stake-amount">
                    {pending}
                </div>
            )}
            {success && CHAIN_ID && (
                <div className="notif success" id="stake-amount">
                    {success + ' '}
                    <a style={{ textDecoration: "underline" }} href={`${CHAIN_INFO[CHAIN_ID].explorer}tx/${stakeTx}`} target="_blank" rel="noreferrer">
                        View on Bscscan
                    </a>
                </div>
            )}
             <div className="notif pending" id="stake-amount">
                 If you already sent your KXA to the BNB bridge, do not forget to switch over Ethereum network!
            </div>
        </fieldset>}

        {CHAIN_ID == 1 && 
        <fieldset className="stk">
            <legend>Claim your KXA on Ethereum network</legend>
            {
                <div className="ins">
                    <div className="in inm">
                        <label htmlFor="stake-amount">
                            Amount claimable<small></small>
                        </label>
                        <input
                            type="number"
                            name="stake-amount"
                            min={0}
                            value={amountToClaim}
                            disabled
                            aria-invalid={!!amountToBridge}
                            aria-describedby="stake-amount"
                        />
                    </div>
                    <div className="in inx">
                        <div className="btm">
                            <button className="bt bt-p" onClick={(e) => claimKXA(e)}>
                                <span>Claim KXA</span>
                                <EthereumIcon />
                            </button>
                        </div>
                    </div>
                    <a onClick={() => { updateBalance() } } style={{color:"#e0fbfc"}}href="#">Max.</a>
                </div>
            }
            {error && (
                <div className="notif danger" id="stake-amount">
                    {error}
                </div>
            )}
            {pending && (
                <div className="notif pending" id="stake-amount">
                    {pending}
                </div>
            )}
            {success && CHAIN_ID && (
                <div className="notif success" id="stake-amount">
                    {success + ' '}
                    <a style={{ textDecoration: "underline" }} href={`${CHAIN_INFO[CHAIN_ID].explorer}tx/${stakeTx}`} target="_blank" rel="noreferrer">
                        View on Etherscan
                    </a>
                </div>
            )}
            <div className="notif pending" id="stake-amount">
                  If you don't see your claimed token yet, please wait few minutes (average waiting time ~30min) and come back later!<br/>
                  Total already claimed: <span style={{fontSize:18, fontWeight:"bold"}}>{totalClaimed} KXA</span>, 
                  Total sent to the BNB bridge: <span style={{fontSize:18, fontWeight:"bold"}}>{totalBridged} KXA</span>
            </div>
        </fieldset>}

        </form>
                </div>
            </div>
            </div>
       
        </>
    );
};

export default Bridge
