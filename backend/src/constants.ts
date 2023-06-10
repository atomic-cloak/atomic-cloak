import abi from './data/abi/AtomicCloak.json'

export const graphqlEndpoints = {
  Sepolia: 'https://api.studio.thegraph.com/proxy/48185/atomiccloak/v0.0.6',
  Mumbai: ''
}

export const atomicCloakABI = abi.abi

export const rpcProviders = {
  Sepolia: 'https://rpc2.sepolia.org',
  Mumbai: 'https://rpc-mumbai.maticvigil.com/'
}
