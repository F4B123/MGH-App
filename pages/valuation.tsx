import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import "animate.css"
import Image from "next/image";
import { HiOutlineSearch } from "react-icons/hi"
import { BsQuestionCircle } from "react-icons/bs"


import Footer from "../components/Footer";
import Toolbar from "../components/Toolbar";
import PriceCard from "../components/PriceCard";
import Valuation from "../components/Valuation";


const ValuationPage: NextPage = ({ prices }: any) => {
    const [ethPrice, setETHPrice] = useState("");
    const [usdPrice, setUSDPrice] = useState("");
    const [sandPrice, setSANDPrice] = useState("");
    const [name, setName] = useState("");
    const [tokenID, setTokenID] = useState("");
    const [imageLink, setImageLink] = useState("");
    const [openseaLink, setOpenseaLink] = useState("");
    const [sandboxLink, setSandboxLink] = useState("");

    const [idProcessing, setIdProcessing] = useState(false);
    const [coordinatesProcessing, setCoordinatesProcessing] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [idError, setIdError] = useState("");
    const [coordinatesError, setCoordinatesError] = useState("");


    const convertPrices = (eth: number) => {
        const ethUSD = prices.ethereum.usd;
        const sandUSD = prices["the-sandbox"].usd;
        const USDfromETH = Math.round(eth * ethUSD);
        const SANDfromETH = Math.round(USDfromETH / sandUSD);
        return [USDfromETH, SANDfromETH]
    }

    const handleCoordinatesSubmit = async (ev: any) => {
        ev.preventDefault();

        const X = (document.getElementById('X') as HTMLInputElement).value
        const Y = (document.getElementById('Y') as HTMLInputElement).value

        setCoordinatesProcessing(true);
        setUSDPrice("")
        setSANDPrice("")
        setImageLink("")

        try {
            const res = await fetch("/api/getLandData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ X: X, Y: Y })
            });
            const data = await res.json()
            if (data.err) {
                setCoordinatesError("Invalid Coordinates")
                setShowCard(false);
            } else {
                setName(data.name);
                setTokenID(data.tokenId);
                setImageLink(data.images.image_url)
                setOpenseaLink(data.opensea_link)
                setSandboxLink(data.external_link)
                const price = data.prices.predicted_price;
                const [USDfromETH, SANDfromETH] = convertPrices(price)
                setETHPrice(price.toLocaleString({ maximumFractionDigits: 4 }))
                setSANDPrice(SANDfromETH.toLocaleString())
                setUSDPrice(USDfromETH.toLocaleString())
                setShowCard(true);
            }
            setCoordinatesProcessing(false);

        } catch (e) {
            setCoordinatesError("Something went wrong, please try again later");
            setShowCard(false);
            setCoordinatesProcessing(false);
        }

    }

    const handleIDSubmit = async (ev: any) => {
        ev.preventDefault();

        const tokenID = (document.getElementById('tokenID') as HTMLInputElement).value

        setIdProcessing(true);
        setUSDPrice("")
        setSANDPrice("")
        setImageLink("")

        try {
            const res = await fetch("/api/getLandData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ tokenID: tokenID })
            });
            const data = await res.json()
            if (data.err) {
                setIdError("Invalid token ID")
                setShowCard(false);
            } else {
                setName(data.name);
                setTokenID(data.tokenId);
                setImageLink(data.images.image_url)
                setOpenseaLink(data.opensea_link)
                setSandboxLink(data.external_link)
                const price = data.prices.predicted_price;
                const [USDfromETH, SANDfromETH] = convertPrices(price)
                setETHPrice(price.toLocaleString({ maximumFractionDigits: 4 }))
                setSANDPrice(SANDfromETH.toLocaleString())
                setUSDPrice(USDfromETH.toLocaleString())
                setShowCard(true);
            }
            setIdProcessing(false);

        } catch (e) {
            setIdError("Something went wrong, please try again later");
            setShowCard(false);
            setIdProcessing(false);
        }
    }

    return (
        <>
            <Head>
                <title>MGH - LAND valuation</title>
                <meta name="description" content="Governance of metaverse related items, fair valuation and minting of NFT backed tokens and provision of metaverse market data." />
            </Head>

            <div className="col-span-full flex flex-col items-start p-5 w-full bg-grey-darkest bg-opacity-30 border-t border-l border-opacity-20 rounded-3xl shadow-black">
                <h2 className="text-transparent bg-clip-text bg-gradient-to-b from-blue-500 via-green-400 to-green-500 pt-5">LAND Valuation</h2>
                <p className={`text-lg xl:text-xl font-medium text-gray-200 mt-5`}>Find the real value of The Sandbox LANDs with our machine learning pricing algorithm.</p>
            </div>

            <Valuation prices={prices} />

        </>
    )
};

export async function getStaticProps() {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox&vs_currencies=usd")
    const prices = await res.json();

    return {
        props: {
            prices,
        },
    }
}

export default ValuationPage;
