export enum SupportedChainId {
  MAINNET_BSC = 56,
  TESTNET_BSC = 97,
  MAINNET_ETH = 1,
  POLYGON = 137
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET_ETH,
  SupportedChainId.MAINNET_BSC,
  SupportedChainId.TESTNET_BSC,
  SupportedChainId.POLYGON,
]

export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET_ETH,
  SupportedChainId.MAINNET_BSC,
  SupportedChainId.TESTNET_BSC,
  SupportedChainId.POLYGON,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

export interface L1ChainInfo {
  readonly id: number
  readonly tokenAddress: string
  readonly bridgeInContract: string
  readonly bridgeOutContract: string
  readonly nftContractAddress: string
  readonly stakingContractAddress: string
  readonly gameAddress: string
  readonly nftBundles: string
  readonly blockWaitMsBeforeWarning?: number
  readonly explorer: string
  readonly apiURL: string
  readonly label: string
  readonly logoUrl?: string
  readonly rpcUrls?: string[]
  readonly nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export type ChainInfo = { readonly [chainId: number]: L1ChainInfo } & {
  readonly [chainId in SupportedL1ChainId]: L1ChainInfo
}

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.MAINNET_BSC]: {
    id: 56,
    tokenAddress: "0x2223bF1D7c19EF7C06DAB88938EC7B85952cCd89",
    bridgeInContract: "0x56df7fb32638D866b98564C46A6c6b3E5AB48426",
    bridgeOutContract: "0x3A45DE9d92B45E29Eb46C2554cd70B9aa7FC6ACC",
    nftContractAddress: "0x6e2722dbaa4a1bd9a7c8c5060af396460e133001",
    stakingContractAddress: "0x1be0b4f77b4f6cA12e6D909322990944168Cb5B0",
    gameAddress: "",
    nftBundles: "",
    explorer: 'https://bscscan.com/',
    apiURL: "https://kryx-app-web-api.azurewebsites.net",
    label: 'Binance Smart Chain',
    rpcUrls: ['https://bsc-dataseed.binance.org/', 'https://bsc-dataseed1.defibit.io/'],
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  },
  [SupportedChainId.MAINNET_ETH]: {
    id: 1,
    tokenAddress: "0x2223bF1D7c19EF7C06DAB88938EC7B85952cCd89",
    bridgeInContract: "0x56df7fb32638D866b98564C46A6c6b3E5AB48426",
    bridgeOutContract: "0x3A45DE9d92B45E29Eb46C2554cd70B9aa7FC6ACC",
    nftContractAddress: "0xc903de9b38dca27f269d7f7890d787d398b8c991",
    stakingContractAddress: "0x1be0b4f77b4f6cA12e6D909322990944168Cb5B0",
    gameAddress: "0xF12B9851FA386be7cA8068b566DB4fAE8684d8BF",
    nftBundles: "",
    explorer: 'https://etherscan.io/',
    apiURL: "https://kryx-app-web-api.azurewebsites.net",
    label: 'Ethereum',
    rpcUrls: ['https://mainnet.infura.io/v3/4f1a24ed50654f56b6ccf068bc54d64c'],
    nativeCurrency: { name:'ETH', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.TESTNET_BSC]: {
    id: 97,
    tokenAddress: "0x2223bF1D7c19EF7C06DAB88938EC7B85952cCd89",
    bridgeInContract: "0x56df7fb32638D866b98564C46A6c6b3E5AB48426",
    bridgeOutContract: "0x3A45DE9d92B45E29Eb46C2554cd70B9aa7FC6ACC",
    nftContractAddress: "0xc903de9b38dca27f269d7f7890d787d398b8c991",
    stakingContractAddress: "0x57613EeE7Fb9E3B311E1Fe1BF7B42b664f65AC89",
    gameAddress: "0xD13899509020119c77F8aE93243Fe9Ab715a125C",
    nftBundles: "0x4A67108DF75A841D725e8b7C88d729A7Ed451c01",
    explorer: 'https://testnet.bscscan.com/',
    apiURL: "https://kryx-app-web-api.azurewebsites.net",
    label: 'Binance Smart Chain Testnet',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/', 'https://data-seed-prebsc-2-s1.binance.org:8545/'],
    nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
  },
  [SupportedChainId.POLYGON]: {
    id: 137,
    tokenAddress: "0x2223bF1D7c19EF7C06DAB88938EC7B85952cCd89",
    bridgeInContract: "0x56df7fb32638D866b98564C46A6c6b3E5AB48426",
    bridgeOutContract: "0x3A45DE9d92B45E29Eb46C2554cd70B9aa7FC6ACC",
    nftContractAddress: "0xc903De9B38dca27F269d7f7890D787d398b8c991",
    stakingContractAddress: "0x57613EeE7Fb9E3B311E1Fe1BF7B42b664f65AC89",
    gameAddress: "0xAFff05E6d4EB404170f4CB45BAae766433fe1545",
    nftBundles: "0x4A67108DF75A841D725e8b7C88d729A7Ed451c01",
    explorer: 'https://testnet.bscscan.com/',
    apiURL: "https://kryx-app-web-api.azurewebsites.net",
    label: 'Polygon',
    rpcUrls: ['https://polygon-rpc.com'],
    nativeCurrency: { name: 'matic', symbol: 'matic', decimals: 18 },
  },
}