import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useNftContract } from "../../hooks/useContract";
import Token from "./token";
import NftCard from "./card";
import { CHAIN_INFO } from "../../constants/chain";

function useLoadTotalSupply(chainId: number, eventCount: number) {
    const [ totalSupply, setTotalSupply ] = useState(0);
    const NFT_CONTRACT = CHAIN_INFO[chainId].nftContractAddress;
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
    }, [chainId, nftContract, eventCount]);

    return totalSupply;
}

function useLoadAccountNFTsCount(chainId: number, account: string | undefined | null, eventCount: number) {
    const [ accountTokensCount, setAccountTokensCount ] = useState(0);
    const NFT_CONTRACT = CHAIN_INFO[chainId].nftContractAddress;
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
    }, [chainId, nftContract, account, eventCount]);
    return accountTokensCount;
}

function useLoadAccountNFTs(chainId: number, account: string | undefined | null, tokenCount: number, eventCount: number) {
    const [ accountTokens, setAccountTokens ] = useState<Token[]>([]);
    const NFT_CONTRACT = CHAIN_INFO[chainId].nftContractAddress;
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
    }, [nftContract, account, tokenCount, eventCount])
    return accountTokens;
}

interface NftViewerProps {
    CHAIN_ID: number,
    ACCOUNT_ID: string,
}

const NftViewer: React.FC<NftViewerProps> = ({CHAIN_ID, ACCOUNT_ID}) => {
    const [ eventCount, setEventCount ] = useState<number>(0);

    const {library} = useWeb3React();
    const totalSupply = useLoadTotalSupply(CHAIN_ID, eventCount);
    let accountNFTsCount = useLoadAccountNFTsCount(CHAIN_ID, ACCOUNT_ID, eventCount);
    let accountNFTs = useLoadAccountNFTs(CHAIN_ID, ACCOUNT_ID, accountNFTsCount, eventCount);

    const NFT_CONTRACT_ADDRESS = CHAIN_INFO[CHAIN_ID].nftContractAddress;
    const GAME_ADDRESS = CHAIN_INFO[CHAIN_ID].gameAddress;
    const nftContract = useNftContract(NFT_CONTRACT_ADDRESS);

    async function sendNftToGame(nftId: number, fnSendingToGame: any) {
        console.log("sending id... " + nftId)
        const transferFrom = await nftContract.transferFrom(ACCOUNT_ID, GAME_ADDRESS, nftId);
        fnSendingToGame(true)
        await library.waitForTransaction(transferFrom.hash, 2);
        setEventCount(eventCount + 1)
        console.log("Done --- transaction succeeded. ")
    }

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
                (nft) =>
                    <NftCard key={nft.id} NFT_ID={nft.id} IPFS_URI={nft.uri} FN_SEND_TO_GAME={sendNftToGame}/>
            )}
            </div>
            <br/>
        </div>
    );
};

export default NftViewer
