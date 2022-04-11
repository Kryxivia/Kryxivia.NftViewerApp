import React, { useEffect, useState } from "react";
import { utils } from "ethers";
import { ReactComponent as MetamaskIcon } from "../../../assets/img/metamask.svg";
import { useWeb3React } from "@web3-react/core";
import { useStakingContract, useTokenContract } from "../../../hooks/useContract";
import { formatUnits } from "@ethersproject/units";
import { useNavigate } from "react-router";
import { CHAIN_INFO } from "../../../constants/chain";
import { useUserStakeAmount } from "../StakedKxa";

function useMintStakeAmount(chainId: number) {
    const [amount, setAmount] = useState("");
    const STAKING_CONTRACT_ADDRESS = CHAIN_INFO[chainId].stakingContractAddress;
    const stakingContract = useStakingContract(STAKING_CONTRACT_ADDRESS);

    useEffect(() => {
        const fetchData = async () => {
            if (stakingContract === null) { return; }
            const result = await stakingContract.getMinimumRequiredLock();
            setAmount(parseFloat(formatUnits(result, 18)).toFixed());
        };

        fetchData();
    }, [setAmount, stakingContract]);

    return amount;
}

interface StakeKxaProps {
    chainId: number,
    accountId: string,
}

export const StakeKxa: React.FC<StakeKxaProps> = ({chainId, accountId}) => {
    const { library } = useWeb3React();
    const userStakedAmount = useUserStakeAmount(chainId, accountId);

    const STAKING_CONTRACT_ADDRESS = CHAIN_INFO[chainId].stakingContractAddress;
    const TOKEN_ADDRESS = CHAIN_INFO[chainId].tokenAddress;

    const stakingContract = useStakingContract(STAKING_CONTRACT_ADDRESS);
    const tokenContract = useTokenContract(TOKEN_ADDRESS);
    let navigate = useNavigate();

    const [amountToStake, setAmountToStake] = useState<string>("");
    const [stakeTx, setStakeTx] = useState<string>();
    const [error, setError] = useState<string>();
    const [pending, setPending] = useState<string>();
    const [success, setSuccess] = useState<string>();
    const minStakeAmount = useMintStakeAmount(chainId);

    const resetFeedback = () => {
        setError("");
        setPending("");
        setSuccess("");
    };

    async function stake(e: any) {
        e.preventDefault();
        resetFeedback();
        if (stakingContract == null || tokenContract == null || amountToStake === "") {
            setError("Enter an amount to stake");
            return;
        }
        const asNumber: number = parseFloat(amountToStake);
        if (asNumber < Number(minStakeAmount)) {
            setError(`Invalid amount to stake needs to be superior than ${asNumber} KXA`);
            return;
        }

        const decimalAmount: any = utils.parseEther(amountToStake);
        try {
            /**Approve contract */
            const allowance = await tokenContract.allowance(accountId, STAKING_CONTRACT_ADDRESS);
            const wei = utils.parseEther("10000000");
            if (parseFloat(allowance) < parseFloat(decimalAmount)) {
                setPending("Allowance pending, please allow the use of your token balance for the contract...");
                const approveTx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, wei.toString());
                setPending("Waiting for 2 confirmations ...");
                await library.waitForTransaction(approveTx.hash, 2);
                setPending("Allowance successfully increased, waiting for deposit transaction...");
                resetFeedback();
            }

            setPending("Pending: check your wallet extension to execute the chain transaction ...");
            const result = await stakingContract.stakeKXA(decimalAmount.toString());
            setPending("Waiting for 2 confirmations...");
            const txReceipt = await library.waitForTransaction(result.hash, 2);
            if (txReceipt.status === 1) {
                resetFeedback();
                setSuccess(`Deposit successfully completed !`);
                setStakeTx(`${txReceipt.transactionHash}`);
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

    if (userStakedAmount !== 0) return <></>;
    return (
        <fieldset className="stk">
            <legend>Stake your KXA now !</legend>
            {!minStakeAmount ? (
                <>loading</>
            ) : (
                <div className="ins">
                    <div className="in inm">
                        <label htmlFor="stake-amount">
                            Amount to stake <small>(min {minStakeAmount} KXA)</small>
                        </label>
                        <input
                            type="number"
                            name="stake-amount"
                            min={Number(minStakeAmount)}
                            placeholder={minStakeAmount}
                            value={amountToStake}
                            onChange={(e) => {
                                setAmountToStake(e.target.value);
                            }}
                            aria-invalid={!!amountToStake}
                            aria-describedby="stake-amount"
                        />
                    </div>
                    <div className="in inx">
                        <div className="btm">
                            <button className="bt bt-p" onClick={(e) => stake(e)}>
                                <span>Stake now </span>
                                <MetamaskIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
            {success && chainId && (
                <div className="notif success" id="stake-amount">
                    {success + ' '}
                    <a style={{ textDecoration: "underline" }} href={`${CHAIN_INFO[chainId].explorer}tx/${stakeTx}`} target="_blank" rel="noreferrer">
                        View on BSCScan
                    </a>
                </div>
            )}
        </fieldset>
    );
};
