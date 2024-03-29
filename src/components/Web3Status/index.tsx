import React, { useEffect } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { ABIs, NetworkContextName, TOKENS_BY_NETWORK } from "../../constants/misc";
import { shortenAddress } from "../../utils";
import { Wallet } from "../Wallet";
import WalletService from "../../services/walletService";
import { TokenBalance } from "../TokenBalance";
import { EthSWRConfig } from "ether-swr";

const SIGNING_MESSAGE="I agree to connect my wallet to Kryxivia."

const Web3Status: React.FC = () => {
    const { active, error, account, library, chainId } = useWeb3React();
    const contextNetwork = useWeb3React(NetworkContextName);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem("session-" + (account || "").toLowerCase()) as string) || "";
        if (!!(library && account) && !session) {
            library
                .getSigner(account)
                .signMessage(SIGNING_MESSAGE)
                .then(async (signature: any) => {
                    await WalletService.authWallet(chainId || 0, account, signature);
                })
                .catch((error: any) => {
                    console.log("Failure!" + (error && error.message ? `\n\n${error.message}` : ""));
                });
        }
    }, [chainId, account, library]);

    return (
        <div className="r">
            {account && chainId && (
                <EthSWRConfig value={{ web3Provider: library, ABIs: new Map(ABIs(chainId)) }}>
                    <div className="bt" style={{ fontSize: "0.9em" }}>

                        {TOKENS_BY_NETWORK[chainId].map((token) => (
                            <TokenBalance key={token.address} {...token} />
                        ))}
                        <br/>
                        {shortenAddress(account)}
                    </div>
                </EthSWRConfig>
            )}
            {error && <div className="bt">{error instanceof UnsupportedChainIdError ? `Wrong network` : Error}</div>}
            {(contextNetwork.active || active) && !account && <Wallet />}
        </div>
    );
};

export default Web3Status;
