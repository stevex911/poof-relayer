require('dotenv').config()

const { jobType } = require('./constants')
const { deployments, alfajoresAddresses, mainnetAddresses } = require('@poofcash/poof-kit')
const pools = {
  42220: [],
  44787: [
    {
      poolAddress: '0x530593A254636BE43dEd686a75fc43E31012EcaF',
      tokenAddress: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
      symbol: 'cUSD',
      decimals: 18,
    },
  ],
}
module.exports = {
  netId: Number(process.env.NET_ID) || 42220,
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  httpRpcUrl: process.env.HTTP_RPC_URL,
  wsRpcUrl: process.env.WS_RPC_URL,
  oracleRpcUrl: process.env.ORACLE_RPC_URL || 'https://mainnet.infura.io/',
  offchainOracleAddress: '0x080AB73787A8B13EC7F40bd7d00d6CC07F9b24d0',
  aggregatorAddress: process.env.AGGREGATOR,
  minerMerkleTreeHeight: 20,
  privateKey: process.env.PRIVATE_KEY,
  instances: deployments,
  poof: process.env.NET_ID === '42220' ? mainnetAddresses : alfajoresAddresses,
  port: process.env.PORT || 8000,
  poofServiceFee: Number(process.env.REGULAR_POOF_WITHDRAW_FEE),
  miningServiceFee: Number(process.env.MINING_SERVICE_FEE),
  rewardAccount: process.env.REWARD_ACCOUNT,
  gasLimits: {
    [jobType.POOF_WITHDRAW]: 350000,
    [jobType.MINING_REWARD]: 455000,
    [jobType.MINING_WITHDRAW]: 400000,
  },
  minimumBalance: '1000000000000000000',
  pools,
}
