import React, { useEffect, useState } from "react";
import { CHAIN_INFO } from "../../constants/chain";
import {useOutletContext} from "react-router-dom";
import {accountContext} from "../../constants/context";
import {useNftBundleContract} from "../../hooks/useContract";
import {BigNumber, Contract} from "ethers";
import BoxView from "./boxView";

export interface Box {
    name: string,
    price: BigNumber,
    items: number,
    active: boolean
}

export function useBundleList(chainId: number) {
    const [bundles, setBundles] = useState<Box[]>([]);

    const NFT_BUNDLE_ADDRESS = CHAIN_INFO[chainId].nftBundles;
    const nftBundles = useNftBundleContract(NFT_BUNDLE_ADDRESS);

    useEffect(() => {
        const getBundles = async () => {
            if (!nftBundles)
                return;

            const numOfBoxes = await nftBundles.boxNamesLength()
            let boxes = []
            for (let i = 0; i < parseInt(numOfBoxes); i++) {
                let boxName = await nftBundles.boxNames(i)
                let boxDetails = await nftBundles.boxes(boxName)
                let box: Box = {
                    name: boxName,
                    price: boxDetails.price,
                    items: boxDetails.randomItemsBatchesCount,
                    active: boxDetails.isActive,
                }
                if (box.active) {
                    boxes.push(box)
                }
            }
            setBundles(boxes)
        };

        getBundles();
    }, [chainId, nftBundles]);

    return bundles;
}

export const Bundle = () => {
    const context = useOutletContext<accountContext>();
    const chainId = context.chainId
    // const accountId = context.accountId

    const bundles = useBundleList(chainId);

    const NFT_BUNDLE_ADDRESS = CHAIN_INFO[chainId].nftBundles;
    const nftBundles = useNftBundleContract(NFT_BUNDLE_ADDRESS);

    const buyBundle = async (name: string, price: BigNumber) => {
        const result = await nftBundles.open(name, {value: price});
        if (result.txHash) {
            console.log("success", result);
        } else {
            console.log("error", result)
        }
    };


    return (
        <>
            <h1>Buy NFT Bundles</h1>
            {nftBundles === null && (
                <>
                    <h2>Coming soon to mainnet. Currently Alpha testing this feature on testnet.</h2>
                </>
            )}
            {nftBundles !== null && (
                <div className={"bundleContainer"}>
                    {bundles.map((bundle, index) => (
                        <BoxView key={index} boxName={bundle.name} price={bundle.price} fn_buy={buyBundle} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Bundle
