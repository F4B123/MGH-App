import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { Metaverse } from "../../lib/enums";
import { IChartValues } from "../../lib/types";

import {test} from './data';

const AreaChart = dynamic(() => import("./AreaChart"), {
  ssr: false,
});

///////////
const Chart = dynamic(() => import("./Chart"),{
  ssr: false,
})

let markCap:number|any
/////////////

const ChartWrapper = ({ metaverse }: { metaverse: Metaverse }) => {
  const [values, setValues] = useState<any>({});
  const routes = [{route:"avgPriceParcel",label:"Average Price per Parcel"},{route:"floorPrice",label:"Floor Price"},
  {route:"avgPriceParcelPerArea",label:"Average Price per Area"},{route:"individualOwners",label:"Indivual Owners"},
  {route:"maxPrice",label:"Max Price"},{route:"totalNumberOfSales",label:"Total Sales"},
  {route:"stdSalesPrices",label:"std Sales Prices"},{route:"salesVolume",label:"Sales Volume"}]
  //////////
  const routesA = [{route:"richList",label:"Rich List"},{route:"mCap",label:"Market Cap"}]
  ///////////
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
        console.log(routesValues,"routes")
        setValues(routesValues)
        //////
        markCap = await test(metaverse,"mCap")
        console.log("markcap",markCap)
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

    <Chart
    metaverse={metaverse}
    data={ markCap}
    label= {"Market Cap"}
    />
    </>
  );
};

export default ChartWrapper;
