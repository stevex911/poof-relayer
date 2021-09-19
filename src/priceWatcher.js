const Redis = require('ioredis')
const {redisUrl, offchainOracleAddress, oracleRpcUrl} = require('./config')
const {getArgsForOracle, setSafeInterval} = require('./utils')
const redis = new Redis(redisUrl)
const Web3 = require('web3')
const web3 = new Web3(
  new Web3.providers.HttpProvider(oracleRpcUrl, {
    timeout: 200000, // ms
  }),
)

const offchainOracleABI = require('../abis/OffchainOracle.abi.json')

const offchainOracle = new web3.eth.Contract(offchainOracleABI, offchainOracleAddress)
const {tokenAddresses, oneUintAmount, currencyLookup} = getArgsForOracle()

const {toBN} = require('web3-utils')

async function main() {
  try {
    // TODO: poof price, rcelo price
    const celoPrices = {'celo': 1.0, 'poof': 1.0, 'rcelo': 0.000015384615, 'cusd': 0.2}
    // for (let i = 0; i < tokenAddresses.length; i++) {
    //   try {
    //     const price = await offchainOracle.methods
    //       .getRate(tokenAddresses[i], '0x0000000000000000000000000000000000000000')
    //       .call()
    //     const numerator = toBN(oneUintAmount[i])
    //     const denominator = toBN(10).pow(toBN(18)) // eth decimals
    //     const priceFormatted = toBN(price).mul(numerator).div(denominator)

    //     celoPrices[currencyLookup[tokenAddresses[i]]] = priceFormatted.toString()
    //   } catch (e) {
    //     console.error('cant get price of ', tokenAddresses[i])
    //   }
    // }

    await redis.hmset('prices', celoPrices)
    console.log('Wrote following prices to redis', celoPrices)
  } catch (e) {
    console.error('priceWatcher error', e)
  }
}

setSafeInterval(main, 30 * 1000)
