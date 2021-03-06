import { Web3Provider } from "@ethersproject/providers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
}
