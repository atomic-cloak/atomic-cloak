import { ethers } from 'ethers'
import { graphqlEndpoints } from '../../constants'
import { sendGraphqlRequest } from '../../graphql/request'
import { OpenSwapRequest } from './types'
import { getAtomicCloakContract } from '../blockchain/blockchain.service'

export const openSwap = async (openSwapRequest: OpenSwapRequest) => {
  const { provider, atomicCloak } = await getAtomicCloakContract(
    openSwapRequest.receivingChainID
  )
  console.log('Getting commitment', openSwapRequest.z)
  const [qsx, qsy] = await atomicCloak.commitmentFromSharedSecret(
    openSwapRequest.qx,
    openSwapRequest.qy,
    ethers.utils.randomBytes(32)
  )
  console.log('qsx', qsx, 'qsy', qsy, 'amount', openSwapRequest.value, ethers.utils.parseUnits(openSwapRequest.value, 'ether'))

  const gasPrice = provider.getGasPrice()
  const blockNumberBefore = await provider.getBlockNumber()
  const timestampBefore = (await provider.getBlock(blockNumberBefore)).timestamp
  const tx = await atomicCloak.openETH(
    qsx,
    qsy,
    openSwapRequest.addressTo,
    timestampBefore + 10000,
    {
      value: `${openSwapRequest.value}`,
      gasPrice
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
