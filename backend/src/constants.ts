import abi from './data/abi/AtomicCloak.json'

export const graphqlEndpoints = {
  11155111: 'https://api.studio.thegraph.com/proxy/48185/atomic-cloak-sepolia/version/latest',
  80001: 'https://api.studio.thegraph.com/query/48185/atomic-cloack-mumbai/version/latest'
}

export const atomicCloakABI = abi.abi

export const rpcProviders = {
  11155111: 'https://rpc2.sepolia.org',
  80001: 'https://rpc-mumbai.maticvigil.com/'
}
