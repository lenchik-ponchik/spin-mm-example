import config from '../configs/config.js'
import { WebsocketUpdates } from './ccxws.js'
import { RefPricer } from './ref-sdk.js'
import BigNumber from 'bignumber.js'
import { spot } from '@spinfi/core'

const watcher = new WebsocketUpdates()
const refWatcher = new RefPricer()
const secondRefWatcher = new RefPricer()

export async function getLastPrice(spinMarket?: spot.Market): Promise<number> {
  const priceSource = config.get('price.source')

  if (['binance', 'ftx'].includes(priceSource)) {
    return await watcher.getPrice()
  }

  if (priceSource === 'ref') {
    const poolId = +config.get('price.source_ticker').split(', ')[0]
    const secondPoolId = +config.get('price.source_ticker').split(', ')[1] || 0

    if (!secondPoolId) {
      return await refWatcher.getPrice(poolId, spinMarket)
    } else {
      const pool_1_price = await refWatcher.getPrice(poolId, spinMarket)
      const pool_2_price = await secondRefWatcher.getPrice(secondPoolId, spinMarket)
      return new BigNumber(pool_2_price).div(new BigNumber(pool_1_price)).toNumber()
    }
  }

  return 0
}
