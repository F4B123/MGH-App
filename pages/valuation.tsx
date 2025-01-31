import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import "animate.css"
import { HiOutlineSearch } from "react-icons/hi"
import { BsQuestionCircle } from "react-icons/bs"

import PriceCard from "../components/PriceCard";
import { Metaverse } from "../lib/enums";
import { IAPIData, IPredictions } from "../lib/types";


const ValuationPage: NextPage = ({ prices }: any) => {
    const [apiData, setAPIData] = useState<IAPIData>();
    const [predictions, setPredictions] = useState<IPredictions>()

    const [idProcessing, setIdProcessing] = useState(false);
    const [coordinatesProcessing, setCoordinatesProcessing] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [idError, setIdError] = useState("");
    const [coordinatesError, setCoordinatesError] = useState("");

    const [metaverse, setMetaverse] = useState<Metaverse>(Metaverse.SANDBOX)


    const convertETHPrediction = (ethPrediction: number) => {
        const ethUSD = prices.ethereum.usd;
        const sandUSD = prices["the-sandbox"].usd;
        const usdPrediction = ethPrediction * ethUSD;
        const sandPrediction = usdPrediction / sandUSD;
        return { ethPrediction, usdPrediction, sandPrediction }
    }

    const convertMANAPrediction = (manaPrediction: number) => {
        const ethUSD = prices.ethereum.usd;
        const manaUSD = prices.decentraland.usd;
        const usdPrediction = manaPrediction * manaUSD;
        const ethPrediction = usdPrediction / ethUSD;
        return { ethPrediction, usdPrediction, manaPrediction }
    }

    const handleAPIData = (data: any) => {

        setAPIData(data)
        if (data.metaverse === Metaverse.SANDBOX) {
            const ethPrediction = data.prices.predicted_price;
            const predictions = convertETHPrediction(ethPrediction)
            setPredictions(predictions)
        } else if (data.metaverse === Metaverse.DECENTRALAND) {
            const manaPrediction = data.prices.predicted_price;
            const predictions = convertMANAPrediction(manaPrediction)
            setPredictions(predictions)
        }

        setShowCard(true);

    }

    const handleCoordinatesSubmit = async (ev: any) => {
        ev.preventDefault();
        setCoordinatesError("");

        const X = (document.getElementById('X') as HTMLInputElement).value
        const Y = (document.getElementById('Y') as HTMLInputElement).value

        setCoordinatesProcessing(true);

        try {
            const res = await fetch("/api/getLandData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ X: X, Y: Y, metaverse: metaverse })
            });
            const data = await res.json()
            if (data.err) {
                setCoordinatesError("Not enough data yet")
                setShowCard(false);
            } else {
                handleAPIData(data)
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
        setIdError("");

        const tokenID = (document.getElementById('tokenID') as HTMLInputElement).value

        setIdProcessing(true);

        try {
            const res = await fetch("/api/getLandData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ tokenID: tokenID, metaverse: metaverse })
            });
            const data = await res.json()
            if (data.err) {
                setIdError("Not enough data yet")
                setShowCard(false);
            } else {
                handleAPIData(data)
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

            {/* <div className="h-full w-full flex flex-row items-center justify-evenly mt-8 xl:mt-0"> */}
            <div className="w-full flex flex-col items-center justify-start space-y-10 max-w-4xl mt-8 xl:mt-0">

                <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-b from-blue-500 via-green-400 to-green-500 pb-0 sm:pb-2">LAND Valuation</h2>
                    {/* <p className={`text-lg xl:text-xl font-medium text-gray-200 pt-0 sm:pt-5`}>YOu can also buy the dataset containing detailled raw data about The Sandbox LANDs NFTs on the <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="underline">Ocean Marketplace</a>.</p> */}
                </div>

                <div className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 space-x-0 sm:space-x-5 md:space-x-10 items-stretch justify-between w-full">

                    <div className="flex flex-col justify-between w-full space-y-5 md:space-y-10 lg:space-y-5">

                        <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                            <p className="font-medium text-gray-300 mb-3 pl-1">Choose Metaverse</p>

                            <div className="flex space-x-5">
                                <div onClick={() => setMetaverse(Metaverse.SANDBOX)} className={`flex flex-col items-center justify-center space-y-2 rounded-xl cursor-pointer p-2 px-3 pt-4 w-24 md:w-30 h-24 md:h-30 group focus:outline-none ${metaverse === Metaverse.SANDBOX ? "border-opacity-100" : "border-opacity-40 hover:border-opacity-100"} border focus:border-opacity-100 transition duration-300 ease-in-out`}>
                                    <img src="/images/the-sandbox-sand-logo.png" className={`h-12 md:h-14 ${metaverse === Metaverse.SANDBOX ? "grayscale-0" : "grayscale"} group-hover:grayscale-0 transition duration-300 ease-in-out`} />
                                    <p className="font-medium text-gray-400 text-xs md:text-sm pt-1">Sandbox</p>
                                </div>
                                <div onClick={() => setMetaverse(Metaverse.DECENTRALAND)} className={`flex flex-col items-center justify-center space-y-2 rounded-xl cursor-pointer p-2 px-3 pt-4 w-24 md:w-30 h-24 md:h-30 group focus:outline-none ${metaverse === Metaverse.DECENTRALAND ? "border-opacity-100" : "border-opacity-40 hover:border-opacity-100"} border focus:border-opacity-100 transition duration-300 ease-in-out`}>
                                    <img src="/images/decentraland-mana-logo.png" className={`h-12 md:h-14 ${metaverse === Metaverse.DECENTRALAND ? "grayscale-0" : "grayscale"} group-hover:grayscale-0 transition duration-300 ease-in-out`} />
                                    <p className="font-medium text-gray-400 text-xs md:text-sm pt-1">Decentraland</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                            <div className="relative flex flex-wrap items-center mb-3 pl-1 text-left w-full max-w-sm">
                                <p className="font-medium text-gray-300">Find by Token ID</p>
                                <BsQuestionCircle className="text-gray-300 cursor-pointer peer ml-3 -mt-1" />
                                <p className="absolute -top-7 -left-6 xs:left-0 pl-2 px-2 py-1 rounded-lg bg-black bg-opacity-10 backdrop-filter backdrop-blur font-medium text-xs text-gray-400 hidden peer-hover:block w-70">Find LAND on Opensea &gt; Details &gt; Token ID</p>
                            </div>
                            <form onSubmit={handleIDSubmit} onInput={() => { setIdError(""); setCoordinatesError("") }} className="relative flex items-stretch justify-between space-x-3 lg:space-x-5 w-full rounded-xl max-w-sm">
                                <input required id="tokenID" type="text" placeholder="e.g. 72792" className={`bg-transparent w-full text-white font-medium p-4 focus:outline-none border ${idError ? "border-red-500 border-opacity-100" : "border-opacity-40 "} hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />

                                <button type="submit" className="flex flex-none items-center justify-around bg-gray-200 hover:bg-white transition ease-in-out duration-500 rounded-xl m-1 ml-2 lg:ml-1 shadow-dark hover:shadow-button w-12 xs:w-16 sm:w-12 lg:w-28">
                                    <svg className={`${idProcessing ? "block" : "hidden"} animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full " viewBox="0 0 24 24`} />
                                    <span className="text-black font-medium pt-1 hidden lg:block">Search</span>
                                    <HiOutlineSearch className={`${idProcessing ? "hidden" : "block"} lg:hidden text-2xl`} />
                                </button>
                            </form>
                            <p className="font-medium text-xs text-red-500 mt-1 pl-2 text-left w-full max-w-sm">{idError}</p>

                            <p className="font-medium  text-gray-300 mb-3 pl-1 text-left w-full max-w-sm mt-8">Find by Coordinates</p>
                            <form onSubmit={handleCoordinatesSubmit} onInput={() => { setIdError(""); setCoordinatesError("") }} className="relative flex items-stretch justify-between space-x-3 lg:space-x-5 w-full rounded-xl max-w-sm">
                                <input required id="X" type="text" placeholder="X" className={`bg-transparent w-full text-white font-medium p-4 focus:outline-none border ${coordinatesError ? "border-red-500 border-opacity-100" : "border-opacity-40 "} hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />
                                <input required id="Y" type="text" placeholder="Y" className={`bg-transparent w-full text-white font-medium p-4 focus:outline-none border ${coordinatesError ? "border-red-500 border-opacity-100" : "border-opacity-40 "} hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />

                                <button type="submit" className="flex flex-none items-center justify-around bg-gray-200 hover:bg-white transition ease-in-out duration-500 rounded-xl m-1 ml-2 lg:ml-1 shadow-dark hover:shadow-button w-12 xs:w-16 sm:w-12 lg:w-28">
                                    <svg className={`${coordinatesProcessing ? "block" : "hidden"} animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full " viewBox="0 0 24 24`} />
                                    <span className="text-black font-medium pt-1 hidden lg:block">Search</span>
                                    <HiOutlineSearch className={`${coordinatesProcessing ? "hidden" : "block"} lg:hidden text-2xl`} />
                                </button>
                            </form>
                            <p className="font-medium text-xs text-red-500 mt-1 pl-2 text-left w-full max-w-sm">{coordinatesError}</p>
                        </div>

                    </div>

                    <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full max-w-full sm:max-w-sm bg-grey-dark bg-opacity-30 text-left">
                        <PriceCard showCard={showCard} processing={idProcessing || coordinatesProcessing} apiData={apiData} predictions={predictions} />
                    </div>
                </div>

                <div className="flex flex-col items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">
                    <p className={`text-lg xl:text-xl font-medium text-gray-300`}>You can also buy the full dataset containing detailed raw data about The Sandbox LANDs NFTs on the <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a>.</p>
                </div>

                <div className="flex flex-col items-start shadow-blck rounded-xl py-3 px-4 w-full bg-grey-dark bg-opacity-20 text-left">
                    <p className={`text-xs sm:text-sm text-gray-400`}>The MGH DAO does not provide, personalized investment recommendations or advisory services. Any information provided through the land evaluation tool and others is not, and should not be, considered as advice of any kind and is for information purposes only. That land is “valuated” does not mean, that it is in any way approved, checked audited, and/or has a real or correct value. In no event shall the MGH DAO be liable for any special, indirect, or consequential damages, or any other damages of any kind, including but not limited to loss of use, loss of profits, or loss of data, arising out of or in any way connected with the use of or inability to use the Service, including without limitation any damages resulting from reliance by you on any information obtained from using the Service.</p>
                </div>
            </div>
            {/* </div> */}
        </>
    )
};

export async function getStaticProps() {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cthe-sandbox%2Cdecentraland&vs_currencies=usd")
    const prices = await res.json();

    return {
        props: {
            prices,
        },
    }
}

export default ValuationPage;
