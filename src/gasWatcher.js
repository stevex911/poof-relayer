const {setSafeInterval} = require('./utils')
const {newKitFromWeb3, CeloContract} = require('@celo/contractkit')
const Web3 = require('web3')
const Redis = require('ioredis')
const {httpRpcUrl, redisUrl} = require('./config')

const redis = new Redis(redisUrl)

async function main() {
  try {
    const gasPrices = await getGasPrices()
    await redis.hmset('gasPrices', gasPrices)
    console.log('Wrote following gasPrices to redis', gasPrices)
  } catch (e) {
    console.error('gasWatcher error', e)
  }
}

async function getGasPrices() {
  const web3 = new Web3(httpRpcUrl)
  const kit = newKitFromWeb3(web3)
  const gasPrices = {}
  const wiggles = [1.3]
  for (let i = 0; i < wiggles.length; i++) {
    const wiggle = wiggles[i]
    try {
      const goldTokenAddress = await kit.registry.addressFor(CeloContract.GoldToken)
      const gasPriceMinimumContract = await kit.contracts.getGasPriceMinimum()
      const gasPriceMinimum = await gasPriceMinimumContract.getGasPriceMinimum(goldTokenAddress)
      const gasPrice = gasPriceMinimum * wiggle // in CELO
      const gasPriceInGwei = gasPrice / Math.pow(10, 9)
      gasPrices[wiggle] = gasPriceInGwei.toString()
    } catch (e) {
      console.error(`cant get price @ ${wiggle}: ${e.toString()}`)
    }
  }
  return gasPrices
}

setSafeInterval(main, 30 * 1000)
