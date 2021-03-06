export enum SupportedChainId {
  MAINNET = 56,
  TESTNET = 97,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.TESTNET,
]

export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.TESTNET,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

export interface L1ChainInfo {
  readonly id: number
  readonly tokenAddress: string
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
  [SupportedChainId.MAINNET]: {
    id: 56,
    tokenAddress: "0x2223bF1D7c19EF7C06DAB88938EC7B85952cCd89",
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
  [SupportedChainId.TESTNET]: {
    id: 97,
    tokenAddress: "0x2223bF1D7c19EF7C06DAB88938EC7B85952cCd89",
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
}