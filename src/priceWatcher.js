const Redis = require('ioredis')
const { redisUrl, oracleRpcUrl } = require('./config')
const { setSafeInterval } = require('./utils')
const redis = new Redis(redisUrl)
const { newKitFromWeb3 } = require('@celo/contractkit')
const { fromWei, toWei } = require('web3-utils')
const Web3 = require('web3')
const web3 = new Web3(
  new Web3.providers.HttpProvider(oracleRpcUrl, {
    timeout: 200000, // ms
  }),
)
const kit = newKitFromWeb3(web3)

async function main() {
  try {
    // TODO: poof price, rcelo price

    // Get cUSD price in CELO
    const exchange = await kit.contracts.getExchange()
    const celoPriceCusd = Number(fromWei((await exchange.quoteGoldSell(toWei('1'))).toString()))

    const celoPrices = { celo: 1.0, poof: 1.0, rcelo: 0.000015384615, cusd: 1 / celoPriceCusd }

    await redis.hmset('prices', celoPrices)
    console.log('Wrote following prices to redis', celoPrices)
  } catch (e) {
    console.error('priceWatcher error', e)
  }
}

setSafeInterval(main, 30 * 1000)
