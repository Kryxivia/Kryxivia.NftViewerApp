import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { injected } from '../../connectors';
import { ReactComponent as MetamaskIcon } from "../../assets/img/metamask.svg";
import BitkeepIcon from "../../assets/img/bitkeepwallet.png";

interface WalletSelectionModalProps {
    setIsWalletModalOpen: (isOpen: boolean) => void;
    tryActivation: () => void;
}

const WalletSelectionModal = ({ setIsWalletModalOpen, tryActivation }: WalletSelectionModalProps) => {

    const { activate } = useWeb3React();

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const tryActivationBitkeep = async () => {

        const { ethereum } = window

        // TODO import from web3.ts
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                // eat errors
                activate(injected, undefined, true).catch((error) => {
                    console.error('Failed to activate after accounts changed', error)
                })
            }
        }
        ethereum.on('accountsChanged', handleAccountsChanged)
        const browserwindow = window as any;
        const BitKeepProvider = browserwindow?.bitkeep && browserwindow?.bitkeep.ethereum;

        await BitKeepProvider.request({ method: 'eth_requestAccounts' });
    };
    
    if(mounted) {
        return ReactDOM.createPortal ((
            <div className='modalOverlay' onClick={() => setIsWalletModalOpen(false)}>
                <div className='modal'>
                    <div className='wallet' onClick={tryActivation}>
                        <MetamaskIcon style={{width: '4.6rem'}} />
                        <div className='wallet__title'>Metamask</div>
                        <div className='wallet__description'>Connect to your MetaMask wallet</div>
                    </div>
                    <div className='wallet' onClick={tryActivationBitkeep}>
                        <img src={BitkeepIcon} alt='bitkeepIcon' style={{width: '4.6rem'}} />
                        <div className='wallet__title'>Bitkeep</div>
                        <div className='wallet__description'>Connect to your Bitkeep wallet</div>
                    </div>
                </div>
            </div>
        ), document.getElementById('modal-root') as HTMLElement)
    } else {
        return null
    }
}

export default WalletSelectionModal