import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CHAIN_INFO } from "../../../constants/chain";
import { useStakingContract } from "../../../hooks/useContract";

export function useUserStakeAmount(chainId: number, accountId: string) {
    const [amount, setAmount] = useState(0);
    const STAKING_CONTRACT_ADDRESS = CHAIN_INFO[chainId].stakingContractAddress;
    const stakingContract = useStakingContract(STAKING_CONTRACT_ADDRESS);

    useEffect(() => {
        const fetchData = async () => {
            const result = await stakingContract.getAddrLockAmount(accountId);
            setAmount(Number(parseFloat(formatUnits(result, 18)).toFixed()));
        };

        fetchData();
    }, [accountId, setAmount, stakingContract]);

    return amount;
}

function useGetStartBlock(chainId: number, accountId: string) {
    const [startBlock, setStartBlock] = useState(0);
    const STAKING_CONTRACT_ADDRESS = CHAIN_INFO[chainId].stakingContractAddress;
    const stakingContract = useStakingContract(STAKING_CONTRACT_ADDRESS);

    useEffect(() => {
        const fetchBlock = async () => {
            const result = await stakingContract.getAddrStartBlock(accountId);
            const block = BigNumber.from(result);
            setStartBlock(block.toNumber());
        };

        fetchBlock();
    }, [accountId, setStartBlock, stakingContract]);

    return startBlock;
}

function useGetStartBlockTimestamp(startBlock: number) {
    const [startBlockTimestamp, setStartBlockTimestamp] = useState(0);

    const { library } = useWeb3React();

    useEffect(() => {
        const fetchBlock = async () => {
            const result = await library.getBlock(startBlock);
            const timestamp = result.timestamp * 1000;
            setStartBlockTimestamp(timestamp);
        };

        fetchBlock();
    }, [library, startBlock]);

    return startBlockTimestamp;
}

function useGetEndBlock(chainId: number, accountId: string) {
    const [endBlock, setEndBlock] = useState(0);
    const STAKING_CONTRACT_ADDRESS = CHAIN_INFO[chainId].stakingContractAddress;
    const stakingContract = useStakingContract(STAKING_CONTRACT_ADDRESS);

    useEffect(() => {
        const fetchBlock = async () => {
            const result = await stakingContract.getAddrEndBlock(accountId);
            const block = BigNumber.from(result);
            setEndBlock(block.toNumber());
        };

        fetchBlock();
    }, [accountId, setEndBlock, stakingContract]);

    return endBlock;
}

function useUnlockDate(startBlock: number, endBlock: number, startBlockTimestamp: number) {
    const [unlockDate, setUnlockDate] = useState<string>();
    const [dateObj, setDateObj] = useState<Date>(new Date());

    function addDays(date: any, days: any) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    useEffect(() => {
        const fetchData = async () => {
            const end = new Date(startBlockTimestamp);
            const diff = endBlock - startBlock;
            // 27000 is average BSC block per day
            const daysLeft = diff / 27000;
            const unlockDate = addDays(end, daysLeft);
            const dateOptions = { year: "numeric", month: "long", day: "numeric" };
            const result = unlockDate?.toLocaleDateString("en-US", dateOptions as any);
            setUnlockDate(result);
            setDateObj(unlockDate);
        };

        fetchData();
    }, [endBlock, setUnlockDate, startBlock, startBlockTimestamp]);

    return { unlockDate, dateObj };
}

function useIsUnlocked(date: Date) {
    const [isUnlocked, setIsUnlocked] = useState<boolean>();

    useEffect(() => {
        const fetchData = async () => {
            const newDate = new Date().toString();

            const today = Date.parse(newDate);
            const unlock = Date.parse(date.toString());

            if (today > unlock) {
                setIsUnlocked(true);
            } else {
                setIsUnlocked(false);
            }
        };

        fetchData();
    }, [date]);

    return isUnlocked;
}

interface StakedKxaProps {
    chainId: number,
    accountId: string,
}

export const StakedKxa: React.FC<StakedKxaProps> = ({chainId, accountId}) => {
    const { library } = useWeb3React();

    const userStakedAmount = useUserStakeAmount(chainId, accountId);
    const startBlock = useGetStartBlock(chainId, accountId);
    const startBlockTimestamp = useGetStartBlockTimestamp(startBlock);
    const endBlock = useGetEndBlock(chainId, accountId);
    const { unlockDate, dateObj } = useUnlockDate(startBlock, endBlock, startBlockTimestamp);
    const isUnlocked = useIsUnlocked(dateObj);

    const STAKING_CONTRACT_ADDRESS = CHAIN_INFO[chainId].stakingContractAddress;

    let navigate = useNavigate();
    const stakingContract = useStakingContract(STAKING_CONTRACT_ADDRESS);
    const [unstakeTx, setUnstakeTx] = useState<string>();
    const [error, setError] = useState<string>();
    const [pending, setPending] = useState<string>();
    const [success, setSuccess] = useState<string>();

    const resetFeedback = () => {
        setError("");
        setPending("");
        setSuccess("");
    };

    async function claim(e: any) {
        e.preventDefault();
        if (stakingContract == null || userStakedAmount === 0) {
            setError("Enter an amount to stake");
            return;
        }
        try {
            setPending("Pending: check your wallet extension to execute the chain transaction ...");
            const result = await stakingContract.unStakeKXA();
            setPending("Waiting for 2 confirmations ...");
            const txReceipt = await library.waitForTransaction(result.hash, 2);
            if (txReceipt.status === 1) {
                resetFeedback();
                setSuccess(`Deposit successfully completed !`);
                setUnstakeTx(`${txReceipt.transactionHash}`)
            }
            navigate("/");
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

    if (userStakedAmount === 0) return <></>
    return (
        <fieldset className="stk-g">
            <legend>Your KXA staked</legend>
            <div className="ins">
                <div className="in inm">
                    <label htmlFor="staked">Your total KXA staked</label>
                    <input type="number" name="staked" value={userStakedAmount} disabled />
                </div>
                <div className="in inx">
                    <div className="btm">
                        {!!userStakedAmount ? (
                            <button className="bt bt-nh" onClick={(e) => claim(e)} disabled={!isUnlocked}>
                                {!isUnlocked ? (
                                    <span>
                                        <small>Unlock date</small>
                                        <strong>{unlockDate}</strong>
                                    </span>
                                ) : (
                                    <span>
                                        <strong>Unstake</strong>
                                    </span>
                                )}
                            </button>
                        ) : (
                            <button className="bt bt-nh" disabled>
                                <strong>No KXA staked</strong>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {error && (
                <div className="notif danger" id="staked-amount">
                    {error}
                </div>
            )}
            {pending && (
                <div className="notif pending" id="staked-amount">
                    {pending}
                </div>
            )}
            {success && chainId && (
                <div className="notif success" id="staked-amount">
                    {success + ' '}
                    <a style={{textDecoration: 'underline'}} href={`${CHAIN_INFO[chainId].explorer}tx/${unstakeTx}`} target="_blank" rel="noreferrer">View on BSCScan</a>
                </div>
            )}
        </fieldset>
    );
};
