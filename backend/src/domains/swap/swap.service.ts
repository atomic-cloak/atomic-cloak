import { ethers } from 'ethers'
import { graphqlEndpoints } from '../../constants'
import { sendGraphqlRequest } from '../../graphql/request'
import { OpenSwapRequest } from './types'
import { getAtomicCloakContract } from '../blockchain/blockchain.service'

const swapDB = {}

export const openSwap = async (openSwapRequest: OpenSwapRequest) => {
  const { provider, signer, atomicCloak } = await getAtomicCloakContract(
    openSwapRequest.receivingChainID
  )
  console.log('Getting commitment')
  const [qsx, qsy] = await atomicCloak.commitmentFromSharedSecret(
    openSwapRequest.qx,
    openSwapRequest.qy,
    openSwapRequest.z
  )
  console.log('qsx:', qsx, 'qsy:', qsy)

  const gasPrice = provider.getGasPrice()
  const blockNumberBefore = await provider.getBlockNumber()
  const timestampBefore = (await provider.getBlock(blockNumberBefore)).timestamp
  const timestamp = timestampBefore + 10000
  const tx = await atomicCloak.openETH(
    qsx,
    qsy,
    openSwapRequest.addressTo,
    timestamp,
    {
      value: `${openSwapRequest.value}`,
      gasPrice
    }
  )
  console.log('Open transaction:', tx)
  const swapId = await atomicCloak.commitmentToAddress(
    openSwapRequest.qx,
    openSwapRequest.qy
  )
  swapDB[swapId.toString('hex')] = {
    timelock: timestamp,
    tokenContract: '0x',
    value: `${openSwapRequest.value}`,
    sender: signer.address,
    recipient: openSwapRequest.addressTo,
    chainId: openSwapRequest.receivingChainID
  }
}

export const getMirror = async (swapId: string) => {
  const checkGraph = async (swapID) => {
    if (!swapDB[swapID]) {
      return null
    }
    const response = await sendGraphqlRequest(
      graphqlEndpoints[swapDB[swapID].chainId],
      `
      query Query ($swapID: String!) {
        opens(where: { _swapID: $swapID }) {
          _swapID
        }
      }`,
      { swapID }
    )
    return response.data.opens.length > 0
  }

  if (!swapId.startsWith('0x')) {
    if (await checkGraph(`0x${swapId}`)) {
      return swapDB[`0x${swapId}`]
    }
    return null
  }

  if (await checkGraph(swapId)) {
    return swapDB[swapId]
  }
  return null
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
