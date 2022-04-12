import React, { useEffect, useState } from "react";
import { AlphaRegister } from "../AlphaRegister";

interface AlphaStateProps {
    chainId: number,
    accountId: string,
    winners: {publicKey: string}[]
}

function useGetValidatedState(accountId: string, winners: {publicKey: string}[]) {
    const [isValidated, setIsValidated] = useState(false);

    useEffect(() => {
        const fetchAccess = async () => {
            if (winners === null || winners === undefined) {
                return;
            }
            const winner = winners.find((x: any) => x.publicKey.toLowerCase() === (accountId || "").toLowerCase());
            let whitelisted = !!winner;
            setIsValidated(whitelisted);
            return whitelisted;
        };

        fetchAccess();
    }, [accountId, winners, setIsValidated]);

    return isValidated;
}

export const AlphaState: React.FC<AlphaStateProps> = ({chainId, accountId, winners}) => {
    const hasAccess = useGetValidatedState(accountId, winners);

    return (
        <>
            {accountId && hasAccess && <div>
                <div className="alert success">YOU HAVE ALPHA ACCESS</div>
                <AlphaRegister chainId={chainId} accountId={accountId }/>
            </div>
            }
            {accountId && !hasAccess && <div className="alert base">YOU DO NOT HAVE ALPHA ACCESS</div>}
        </>
    );
};
