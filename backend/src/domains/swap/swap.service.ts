import { ethers } from 'ethers'
import {
  contractABI,
  contractAddresses,
  rpcProviders,
  graphqlEndpoints
} from '../../constants'
import { sendGraphqlRequest } from '../../graphql/request'
import { OpenSwapRequest } from './types'

const getAtomicCloakContract = (chainId) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcProviders[chainId])
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider)
  const signer = wallet.connect(provider)
  const atomicCloak = new ethers.Contract(contractAddresses[chainId], contractABI, signer)
  return { provider, signer, atomicCloak }
}

export const openSwap = async (openSwapRequest: OpenSwapRequest) => {
  const { provider, atomicCloak } = getAtomicCloakContract(openSwapRequest.receivingChainID)
  const [qsx, qsy] = await atomicCloak.commitmentFromSharedSecret(
    openSwapRequest.qx,
    openSwapRequest.qy,
    openSwapRequest.z
  )
  console.log('qsx', qsx, 'qsy', qsy)

  const tx = await atomicCloak.openETH(
    qsx,
    qsy,
    openSwapRequest.addressTo,
    (await provider.getBlockNumber()) + 10000,
    {
      value: ethers.utils.parseUnits(openSwapRequest.amount, 'ether')
    }
  )
  console.log('Open transaction:', tx)
  await tx.wait()
}

export const getOpenSwapsBySender = async (
  senderAddress: string,
  chainFrom: string,
  chainTo: string
) => {
  const fromEndpoint = graphqlEndpoints[chainFrom]
  const toEndpoint = graphqlEndpoints[chainTo]

  const senderSwapsResponse = await sendGraphqlRequest(
    fromEndpoint,
    `
    query Query ($address: String!) {
      opens(where: { _sender: $address }) {
        _swapID
      }
    }
  `,
    { address: senderAddress }
  )

  const senderSwapIds = senderSwapsResponse.data.opens.map(
    (open) => open._swapID
  )

  const closedSwapsResponse = await sendGraphqlRequest(
    toEndpoint,
    `
    query Query ($ids: [ID!]!) {
      closes(where: {_swapID_in: $ids}) {
        id
      }
    }
  `,
    { ids: senderSwapIds }
  )

  const closedSwapIds = closedSwapsResponse.data.opens.map(
    (open) => open._swapID
  )
}
