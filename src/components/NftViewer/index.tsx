import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useNftContract } from "../../hooks/useContract";
import Token from "./token";
import NftCard from "./card";

export const NFT_CONTRACT = process.env.REACT_APP_CONTRACT_NFT;

function useLoadTotalSupply() {
    const [ totalSupply, setTotalSupply ] = useState(0);
    const nftContract = useNftContract(NFT_CONTRACT);

    useEffect(() => {
        const fetchData = async () => {
            if (nftContract == null) {
                return;
            }
            const resultTotalSupply = await nftContract.totalSupply();
            const totalSupply = parseInt(resultTotalSupply);
            setTotalSupply(totalSupply);
        };

        fetchData();
    }, [nftContract]);

    return totalSupply;
}

function useLoadAccountNFTsCount(account: string | undefined | null) {
    const [ accountTokensCount, setAccountTokensCount ] = useState(0);
    const nftContract = useNftContract(NFT_CONTRACT);

    useEffect(() => {
        const fetchData = async () => {
            if (nftContract == null) {
                return;
            }
            const resultAccountTokensCount = await nftContract.balanceOf(account);
            const accountTokensCount = parseInt(resultAccountTokensCount);
            setAccountTokensCount(accountTokensCount);
        };

        fetchData();
    }, [nftContract, account]);
    return accountTokensCount;
}

function useLoadAccountNFTs(account: string | undefined | null, tokenCount: number) {
    const [ accountTokens, setAccountTokens ] = useState<Token[]>([]);
    const nftContract = useNftContract(NFT_CONTRACT);

    useEffect(() => {
        const fetchData = async () => {
            if (nftContract == null) {
                return;
            }
            const tokenAccumulator: Token[] = [];
            for (let i = 0; i < tokenCount; i++) {
                const responseTokenId = await nftContract.tokenOfOwnerByIndex(account, i);
                const tokenId: number = parseInt(responseTokenId);
                const tokenURI: string = await nftContract.tokenURI(tokenId);

                let token: Token = {
                    id: tokenId,
                    uri: tokenURI,
                }
                tokenAccumulator.push(token);
            }
            setAccountTokens(tokenAccumulator);
        };

        fetchData();
    }, [nftContract, account, tokenCount])
    return accountTokens;
}

const NftViewer: React.FC = () => {
    const { account } = useWeb3React();

    const totalSupply = useLoadTotalSupply();
    const accountNFTsCount = useLoadAccountNFTsCount(account);
    const accountNFTs = useLoadAccountNFTs(account, accountNFTsCount);

    return (
        <div className="nftPage">
            <h1>
                You have { accountNFTsCount } Kryxivia NFT{ accountNFTsCount === 1 ? '' : 's' }.
            </h1>
            <h3>
                Total NFTs Minted: { totalSupply }
            </h3>
            <div className="nftContainer">
            { accountNFTs.map(
                (nft) => <>
                    <NftCard ID={nft.id} IPFS_URI={nft.uri} />
                </>
            )}
            </div>
            <br/>
        </div>
    );
};

export default NftViewer
