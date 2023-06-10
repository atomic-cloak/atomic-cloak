import abi from './data/abi/AtomicCloak.json'

export const graphqlEndpoints = {
  Sepolia: 'https://api.studio.thegraph.com/proxy/48185/atomic-cloak-sepolia/version/latest',
  Mumbai: 'https://api.studio.thegraph.com/query/48185/atomic-cloack-mumbai/version/latest'
}

export const atomicCloakABI = abi.abi

export const rpcProviders = {
  Sepolia: 'https://rpc2.sepolia.org',
  Mumbai: 'https://rpc-mumbai.maticvigil.com/'
}
