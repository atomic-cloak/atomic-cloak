import abi from './data/abi/AtomicCloak.json'

export const graphqlEndpoints = {
  '0xaa36a7': 'https://api.studio.thegraph.com/proxy/48185/atomiccloak/v0.0.6',
  '0x13881': ''
}

export const atomicCloakABI = abi.abi

export const contractAddresses = {
  '0xaa36a7': process.env.ATOMIC_CLOAK_ADDRESS_SEPOLIA,
  '0x13881': process.env.ATOMIC_CLOAK_ADDRESS_MUMBAI
}

export const rpcProviders = {
  '0xaa36a7': 'https://rpc2.sepolia.org',
  '0x13881': 'https://polygon-rpc.com/'
}
