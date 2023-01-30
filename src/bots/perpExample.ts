import logger from '../logger/index.js'
import { PerpClient } from '../client/perp.js'

export const PerpExampleBot = async () => {
  const SpinClient = new PerpClient()

  async function triggersLoop() {
    const balances = await SpinClient.getbalances()
    const orders = await SpinClient.getOrders()
    console.log('—————————————————')
    console.log('BALANCE FROM CODE:', balances)
    console.log('—————————————————')
    console.log('ORDERS FROM CODE:', orders)
    console.log('—————————————————')
  }

  try {
    await SpinClient.init()
    await triggersLoop()
  } catch (err) {
    logger.error(err)
    throw err
  }
}
