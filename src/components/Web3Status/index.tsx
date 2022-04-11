import React from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { ABIs, NetworkContextName, TOKENS_BY_NETWORK } from "../../constants/misc";
import { shortenAddress } from "../../utils";
import { Wallet } from "../Wallet";
import { TokenBalance } from "../TokenBalance";
import { EthSWRConfig } from "ether-swr";

const Web3Status: React.FC = () => {
    const { active, error, account, library, chainId } = useWeb3React();
    const contextNetwork = useWeb3React(NetworkContextName);

    return (
        <div className="r">
            {account && chainId && (
                <EthSWRConfig value={{ web3Provider: library, ABIs: new Map(ABIs(chainId)) }}>
                    <div className="bt" style={{ marginRight: "1rem" }}>
                        {TOKENS_BY_NETWORK[chainId].map((token) => (
                            <TokenBalance key={token.address} {...token} />
                        ))}
                    </div>
                    <div className="bt bt-has">{shortenAddress(account)}</div>
                </EthSWRConfig>
            )}
            {error && <div className="bt">{error instanceof UnsupportedChainIdError ? `Switch to Binance Smart Chain` : Error}</div>}
            {(contextNetwork.active || active) && !account && <Wallet />}
        </div>
    );
};

export default Web3Status;
