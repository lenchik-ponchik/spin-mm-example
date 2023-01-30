import 'reflect-metadata'
import * as dotenvFlow from 'dotenv-flow'
import logger from './logger/index.js'
import config from './configs/config.js'
import { GridBot } from './bots/grid.js'
import { PerpExampleBot } from './bots/perpExample.js'

dotenvFlow.config()

process.on('unhandledRejection', (err) => {
  throw err
})

const bootstrap = async () => {
  const configFile = process.env.CONFIG_FILE || 'default.json'
  try {
    logger.info(`Starting application. Loading ${configFile} config`)

    // Load configuration
    config.loadFile(`./config/${configFile}`)

    // Perform validation
    await config.validate({ allowed: 'strict' })

    logger.info('Configuration successful')

    switch (config.get('market')) {
      case 'spot':
        if (config.get('trader.enable')) {
          throw new Error('Not implemented')
        }
        logger.info('Starting Spot Grid Bot')
        await GridBot()
        break
      case 'perp':
        await PerpExampleBot()
        break
    }
  } catch (err) {
    logger.error({ err }, 'Can not bootstrap application')
    throw err
  }
}

bootstrap().catch(() => {
  process.exit(1)
})

async function closeGracefully(signal) {
  logger.info(`Received signal to terminate: ${signal}`)
  process.exit(0)
}

process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)
