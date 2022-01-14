import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface NftCardProps {
    ID: number,
    IPFS_URI?: string,
}

const ipfsURL = (uri: string | undefined | null) => {
    if (uri === undefined || uri === null) { return "" }
    const splitLink = uri.split("//");
    const docID = splitLink[splitLink.length - 1];
    return "https://ipfs.io/ipfs/" + docID
}

function useAttributeToken(id: number, uri: string | undefined) {
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [image, setImage] = useState();

    const { data } = useSWR(ipfsURL(uri), fetcher);

    useEffect(() => {
        const fetchData = async () => {
            if (data === null || data === undefined) {
                console.log('no data - returning...', uri)
                return;
            }
            setName(data.name);
            setDescription(data.description);
            setImage(data.image);
        };

        fetchData();
    }, [data, uri, setName, setDescription, setImage]);
    return [name, description, image];
}


const NftCard: React.FC<NftCardProps> = ({ID, IPFS_URI}) => {

    let [name, description, image] = useAttributeToken(ID, IPFS_URI);

    return (
        <div className="nftCard" key={ID}>
            <img src={image} alt={name} />
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
                    NFT ID: { ID }
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
