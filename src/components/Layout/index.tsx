import React from "react";
import IllusTop from "../../assets/img/top-h.png";
import IllusTopR from "../../assets/img/top-h-r.png";
import { Header } from "../Header";
import { Outlet } from "react-router-dom";
import { ALL_SUPPORTED_CHAIN_IDS } from "../../constants/chain";
import {useWeb3React} from "@web3-react/core";
import WalletService from "../../services/walletService";

const Layout: React.FC = () => {
    const { account, chainId } = useWeb3React();
    WalletService.verifySessionIntegrity(account || "");
    return (
        <>
            <Header />
            <main id="m">
                <div id="app">
                    { account && chainId && ALL_SUPPORTED_CHAIN_IDS.includes(chainId as number) ? (
                        <>
                            {chainId === 97 && (
                                <div className="alert base">
                                    You are connected to BSC Testnet.
                                    This is all test data for the alpha version.
                                </div>
                            )}
                            <div className={"app-c"}>
                                <Outlet context={{ chainId: chainId, accountId: account }}/>
                            </div>
                        </>
                    ) : (
                        <div className="alert base">
                            Please switch to Ethereum Main-net or BNB Network, Polygon to access the bridge
                            <br/>
                            Or if you are playing on Alpha, Binance Smart Chain Testnet.
                            <br/><br/>
                            <a target="_blank" href="https://wiki.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/"> <u>To view your NFTs and import them in-game, please switch to Polygon network</u></a>
                        </div>

                    )}
                    <div className="copy">Kryxivia © 2022. All rights reserved.
                    
                    {chainId === 137 && (<div style={{fontSize: 10, color: "#ff1313"}}>Connected on Polygon network</div>)}
                    {chainId === 1 && (<div style={{fontSize: 10, color: "#ff1313"}}>Connected on Ethereum network</div>)}
                    {chainId === 56 && (<div style={{fontSize: 10, color: "#ff1313"}}>Connected on BNB network</div>)}
                    {chainId === 97 && (<div style={{fontSize: 10, color: "#ff1313"}}>Connected on BNB testnet network</div>)}
                    </div>
                </div>
            </main>
            <img src={IllusTop} className="top-h" alt="Kryxivia" />
            <img src={IllusTopR} className="top-h-r" alt="Kryxivia" />
        </>
    );
};

export default Layout;
