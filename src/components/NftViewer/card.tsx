import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NftCardProps {
    NFT_ID: number,
    IPFS_URI?: string,
    FN_SEND_TO_GAME: any,
}

interface NftAttribute {
    display_type: string,
    trait_type: string,
    value: any
}

const ipfsURL = (uri: string | undefined | null) => {
    if (uri === undefined || uri === null) { return "" }
    const splitLink = uri.split("//");
    const docID = splitLink[splitLink.length - 1];
    return "https://ipfs.io/ipfs/" + docID
}

function useAttributeToken(id: number, uri: string | undefined): [string | undefined, string | undefined, string | undefined, NftAttribute[]] {
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [image, setImage] = useState<string>();
    const [attributes, setAttributes] = useState<NftAttribute[]>([]);

    const { data } = useSWR(ipfsURL(uri), fetcher);

    useEffect(() => {
        const fetchData = async () => {
            if (data === null || data === undefined) { return }
            setName(data.name);
            setDescription(data.description);
            setImage(data.image);
            setAttributes(data.attributes);
        };

        fetchData();
    }, [data, uri, setName, setDescription, setImage, setAttributes]);
    return [name, description, image, attributes];
}

const NftCard: React.FC<NftCardProps> = ({NFT_ID, IPFS_URI, FN_SEND_TO_GAME}) => {
    const [isHover, setIsHover] = useState(false)
    const [isSendingToGame, setIsSendingToGame] = useState(false)

    let name: string | undefined;
    let description: string | undefined;
    let image: string | undefined;
    let attributes: NftAttribute[] | [];

    [name, description, image, attributes] = useAttributeToken(NFT_ID, IPFS_URI);

    function formatTraitType(name: string) {
        return name.replaceAll("Gem", "")
    }

    async function sendNftToGame(e: any) {
        e.preventDefault();
        FN_SEND_TO_GAME(NFT_ID, setIsSendingToGame);
        // FN_SEND_TO_GAME(97, "0x7Ab2dBfA4545668Dae581C47b63B6e2ff134536a")
    }

    return (
        <div className="nftCard" key={NFT_ID}
             onMouseEnter={() => setIsHover(true)}
             onMouseLeave={() => setIsHover(false)}
        >
            <div className={"imageContainer"}>
                {isHover && (
                <div className={"displaySendToGame"}>
                    <div className={"attributes"}>
                        {!(attributes.filter(a => a.trait_type !== "Creation").length === 0) && (
                        <ul>
                            <li>Attributes:</li>
                            {(attributes).filter(a => a.trait_type !== "Creation").map((a: NftAttribute, index) => (
                            <li key={index}>
                                &nbsp;&nbsp;&nbsp;{formatTraitType(a.trait_type)} - {a.display_type === "BoostNumber" ? Math.round(a.value * 100) / 100 : a.value}
                                <br/>
                            </li>
                        ))}
                        </ul>
                        )}
                    </div>
                    <button
                        className={"bt bt-act"}
                        onClick={(e) => sendNftToGame(e)}
                        disabled={isSendingToGame}
                    >
                        {isSendingToGame ? "Sending..." : "Send To Game" }
                    </button>
                </div>
                )}
                <img src={image} alt={name} />
            </div>
            <div className="details">
                <div className="name">
                    <strong>
                        {name}
                    </strong>
                </div>
                <div className="description">
                    {description}
                </div>
                <div className="header-container">
                <span className="left">
                    NFT ID: { NFT_ID }
                </span>
                    <span className="right">
                    <a href={ipfsURL(IPFS_URI || "")} target="_blank" rel="noreferrer">IPFS Link</a>
                </span>
                </div>
            </div>
        </div>
    );
};

export default NftCard
