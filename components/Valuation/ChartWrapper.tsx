import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { Metaverse } from "../../lib/enums";

import {test} from './data';

const AreaChart = dynamic(() => import("./AreaChart"), {
  ssr: false,
});

const ChartWrapper = ({ metaverse }: { metaverse: Metaverse }) => {
  const [values, setValues] = useState<any>({});
  const routes = [{route:"avgPriceParcel",label:"Average Price per Parcel"},{route:"floorPrice",label:"floor Price"}]
  useEffect(() => {
    console.log("inciando")
    const salesVolumeCall = async () =>
      {
        const routesValues:any = {}
        console.log("foreach");
        for (let element in routes){
          routesValues[routes[element]["route"]] = await test(metaverse,routes[element]["route"]) 
          console.log(routesValues)
        }
        // routes.map(async element => { 
        //     routesValues[element] = await test(metaverse,element) 
        //     console.log(routesValues)
        // });
        console.log(routesValues,"routes")
        setValues(routesValues)
      }
    console.log("terminado")
    salesVolumeCall();
  }, [metaverse]);
  return (
    <>
    {routes.map( element=> {
      if(values[element["route"]])

      return (
        <AreaChart
        metaverse={metaverse}
        data={values[element["route"]]}
        label= {element["label"]}
        />
      )
    })}
      {/* <AreaChart
        metaverse={metaverse}
        data={values}
        symbolOptions={{
          ETH: { key: "ethPrediction" },
          USDC: { key: "usdPrediction" },
          METAVERSE: {
            key: "metaversePrediction",
            sandbox: "SAND",
            decentraland: "MANA",
            "axie-infinity": "AXS",
          },
        }}
        label="Daily Volume"
      />
      <AreaChart
        metaverse={metaverse}
        data={doomies as IChartValues[]}
        label="Floor Price"
      /> */}
    </>
  );
};

export default ChartWrapper;
