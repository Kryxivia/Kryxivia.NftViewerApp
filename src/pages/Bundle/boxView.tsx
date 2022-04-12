import React from "react";
import {BigNumber} from "ethers";
import {formatUnits} from "@ethersproject/units";

interface BoxViewProps {
    boxName: string,
    price: BigNumber,
    fn_buy: any
}

export const BoxView: React.FC<BoxViewProps> = ({boxName, price,  fn_buy}) => {
    return (
        <div className={"bundleCard"}>
            <div className={"bundleCardTitle"}>{boxName}</div>
            <div className={"bundleCardContent"}>
                <button className="bt bt-act" onClick={(e) => fn_buy(boxName, price)}>
                    { parseFloat(formatUnits(price, 18)) } BNB Purchase
                </button>
            </div>
        </div>
    );
};

export default BoxView
