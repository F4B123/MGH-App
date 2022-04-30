import React, { useEffect, useState } from 'react'
import { getCollectionData } from '../../backend/services/openSeaDataManager'
import { Metaverse } from '../../lib/enums'
import { IPredictions } from '../../lib/types'
import { formatMetaverseName } from '../../lib/utilities'
import { ICoinPrices } from '../../lib/valuation/valuationTypes'
import { getAxieFloorPrice } from '../../lib/valuation/valuationUtils'
import { PriceList } from '../General'

interface SymbolProperties {
    key: string
    [key: string]: any
  }
  
  interface Symbol {
    [key: string]: SymbolProperties
  }
  
interface Props {
  metaverse: Metaverse
  coinPrices?: ICoinPrices
  data: number|any
  label: string
  symbolOptions?: Symbol
  defaultSymbol?: string
}

const Chart = ({ 
    data,
    metaverse,
    label 
}: Props) => {
  const [predictions, setPredictions] = useState<IPredictions>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const setData = async () => {
      setLoading(true)
      // Fetch Data from OpenSea
      //const stats = await getCollectionData(metaverse)
    //   if (metaverse === 'axie-infinity') {
    //     // Fetch Data from Axie Market
    //     const floorPrice = Number(await getAxieFloorPrice())
    //     stats.floor_price = floorPrice
    //   }
        //stats.floor_price = floorPrice
        // const formattedMetaverse =
        // metaverse === 'sandbox' ? 'the-sandbox' : metaverse
        // const metaversePrediction =
        // (stats.floor_price * coinPrices.ethereum?.usd) /
        // coinPrices[formattedMetaverse].usd

        const predictions = {
        ethPrediction: data,
        usdPrediction: data, 
        metaversePrediction: data
        }
        setPredictions(predictions)
        setLoading(false)
    }
    setData()
  }, [metaverse])

  return !predictions ? (
    <>
      <div className='flex flex-col items-start gray-box'>
        <p className={`text-lg xl:text-xl font-medium text-gray-300`}>
          We couldn't obtain floor price for the{' '}
          {formatMetaverseName(metaverse)} lands collection. Check{' '}
          <a
            href='https://opensea.io/collection'
            target='_blank'
            className='hover:underline text-pink-600'
          >
            Open Sea Market
          </a>{' '}
          for more information.
        </p>
      </div>
    </>
  ) : (
    <>
      <div className='flex flex-col items-start gray-box'>
        <p className={`text-lg xl:text-xl font-medium text-gray-300 mb-4`}>
          {label}:{' '}
        </p>
        <div
          className={
            (loading ? 'opacity-0' : 'opacity-100') +
            ' transition-all duration-300'
          }
        >
          <PriceList predictions={predictions} metaverse={metaverse} />
        </div>
      </div>
    </>
  )
}

export default Chart
