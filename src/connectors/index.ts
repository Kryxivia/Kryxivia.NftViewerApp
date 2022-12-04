import { InjectedConnector } from "@web3-react/injected-connector";
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from "../constants/chain";
import { NetworkConnector } from "./NetworkConnector";

const NETWORK_URLS: { [key in SupportedChainId]: string } = {
    [SupportedChainId.MAINNET_BSC]: `https://bsc-dataseed.binance.org/`,
    [SupportedChainId.TESTNET_BSC]: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
    [SupportedChainId.MAINNET_ETH]: `https://mainnet.infura.io/v3/4f1a24ed50654f56b6ccf068bc54d64c`,
};

export const network = new NetworkConnector({
    urls: NETWORK_URLS,
});

export const injected = new InjectedConnector({
    supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
});
