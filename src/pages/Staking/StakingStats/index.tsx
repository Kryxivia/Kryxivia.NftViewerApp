import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { useStakingContract, useTokenContract } from "../../../hooks/useContract";
import { formatCurrency } from "../../../utils";
import {CHAIN_INFO} from "../../../constants/chain";

function useTotalLocked(chainId: number) {
    const [amount, setAmount] = useState(0);
    const STAKING_CONTRACT_ADDRESS = CHAIN_INFO[chainId].stakingContractAddress;
    const TOKEN_ADDRESS = CHAIN_INFO[chainId].tokenAddress;
    const tokenContract = useTokenContract(TOKEN_ADDRESS);

    useEffect(() => {
        const fetchData = async () => {
            const result = await tokenContract.balanceOf(STAKING_CONTRACT_ADDRESS);
            setAmount(Number(formatUnits(result, 18)));
        };

        fetchData();
    }, [STAKING_CONTRACT_ADDRESS, setAmount, tokenContract]);

    return amount;
}

function useTotalStakers(chainId: number) {
    const [amount, setAmount] = useState(0);
    const STAKING_CONTRACT_ADDRESS = CHAIN_INFO[chainId].stakingContractAddress;
    const stakingContract = useStakingContract(STAKING_CONTRACT_ADDRESS);

    useEffect(() => {
        const fetchData = async () => {
            if (stakingContract == null) {
                return;
            }
            const result = await stakingContract.getTotalStakers();
            const convert = BigNumber.from(result);
            setAmount(convert.toNumber());
        };

        fetchData();
    }, [setAmount, stakingContract]);

    return amount;
}

function useTotalStakedValue(totalLocked: number, tokenPrice: number) {
    const [amount, setAmount] = useState("$0");

    useEffect(() => {
        const fetchData = async () => {
            const formatted = formatCurrency(totalLocked * tokenPrice, 0, 2, 'USD')
            setAmount(formatted);
        };

        fetchData();
    }, [setAmount, tokenPrice, totalLocked]);

    return amount;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StakingStatsProps {
    chainId: number,
}

export const StakingStats: React.FC<StakingStatsProps> = ({chainId}) => {
    const apiUrl = CHAIN_INFO[chainId].apiURL;
    const URL = `${apiUrl}/api/v1/stats/price/KXA`
    const { data, error } = useSWR(URL, fetcher);
    const totalLocked = useTotalLocked(chainId);
    const totalStakers = useTotalStakers(chainId);
    const [tokenPrice, setTokenPrice] = useState(0)
    const totalStakedValue = useTotalStakedValue(totalLocked, tokenPrice)

    useEffect(() => {
        setTokenPrice(data?.price)
    }, [tokenPrice, data])

    if (error) return <>Can't fetch price</>;
    if (!data) return <>Loading...</>;
    return (
        <fieldset>
            <legend>Staking Information</legend>
            <div className="ins">
                <div className="in">
                    <label htmlFor="total-kxa-user">Total of users staking KXA</label>
                    <input type="number" name="total-kxa-user" value={totalStakers} disabled />
                </div>
                <div className="in">
                    <label htmlFor="total-kxa-staked">Total token KXA staked</label>
                    <input type="number" name="total-kxa-staked" value={totalLocked} disabled />
                </div>
                <div className="in">
                    <label htmlFor="total-kxa-staked-value">Total KXA $ staked</label>
                    <input type="text" name="total-kxa-staked-value" value={'~ ' + totalStakedValue} disabled />
                </div>
            </div>
        </fieldset>
    );
};
