import React from "react";
import IllusTop from "../../assets/img/top-h.png";
import IllusTopR from "../../assets/img/top-h-r.png";
import { Header } from "../Header";
import { Outlet } from "react-router";
import { useWeb3React } from "@web3-react/core";
import { ALL_SUPPORTED_CHAIN_IDS } from "../../constants/chain";
import { CHAIN_INFO } from "../../constants/chain";
import NftViewer from "../NftViewer";

const Layout = () => {
    const { account, chainId } = useWeb3React();
    return (
        <>
            <Header />
            <main id="m">
                <div id="app">
                    { account && chainId && ALL_SUPPORTED_CHAIN_IDS.includes(chainId as number) ? (
                        <div>
                            <NftViewer
                                CHAIN_ID={ chainId }
                                ACCOUNT_ID={ account }
                            />
                        </div>
                    ) : (
                        <div className="alert base">
                            Please switch to Binance Smart Chain Mainnet.
                            <br/>
                            Or if you are playing on Alpha, Binance Smart Chain Testnet.
                            <br/><br/>
                            <a href={"https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain"} target={"_blank"}>
                                <u>Instructions for Configuring Metamask.</u>
                            </a>
                        </div>

                    )}
                    <div className="app-c">
                        <Outlet />
                    </div>
                    <div className="copy">Kryxivia © 2021. All rights reserved.</div>
                </div>
            </main>
            <img src={IllusTop} className="top-h" alt="Kryxivia" />
            <img src={IllusTopR} className="top-h-r" alt="Kryxivia" />
        </>
    );
};

export default Layout;
