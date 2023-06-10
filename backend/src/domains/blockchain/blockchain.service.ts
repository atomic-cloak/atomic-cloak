import { ethers } from 'ethers'
import { atomicCloakABI, rpcProviders } from '../../constants'

export const getAtomicCloakContract = async (chainId) => {
  const contractAddresses = {
    Sepolia: process.env.ATOMIC_CLOAK_ADDRESS_SEPOLIA,
    Mumbai: process.env.ATOMIC_CLOAK_ADDRESS_MUMBAI
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcProviders[chainId])
  const wallet = new ethers.Wallet(
    process.env.BACKEND_PRIVATE_KEY ?? '',
    provider
  )
  const signer = wallet.connect(provider)
  const atomicCloak = new ethers.Contract(
    contractAddresses[chainId],
    atomicCloakABI,
    signer
  )
  console.log("BALANCE: ", await signer.getBalance())
  return { provider, signer, atomicCloak }
}
