import { ethers } from 'ethers'
import { graphqlEndpoints } from '../../constants'
import { sendGraphqlRequest } from '../../graphql/request'
import { OpenSwapRequest } from './types'
import { getAtomicCloakContract } from '../blockchain/blockchain.service'

const swapDB = {}

const closeSwap = async (swapId, swapData) => {
  const senderSwapsResponse = await sendGraphqlRequest(
    graphqlEndpoints[swapData.receivingChainID],
    `
    query Query ($swapID: String!) {
      closes(where: { _swapID: $swapID }) {
        _swapID
        _secretKey
      }
    }
  `,
    { swapID: swapData.mirrorSwapId }
  )

  const secretKeyB = senderSwapsResponse.data.closes[0]?._secretKey

  if (secretKeyB) {
    const { provider, signer, atomicCloak } = await getAtomicCloakContract(
      swapData.sendingChainID
    )

    const curveOrder = await atomicCloak.curveOrder()

    let secretKey
    if (BigInt(secretKeyB) > BigInt(swapData.sharedSecret)) {
      secretKey = BigInt(secretKeyB) - BigInt(swapData.sharedSecret)
    } else {
      secretKey =
        BigInt(curveOrder._hex) +
        BigInt(secretKeyB) -
        BigInt(swapData.sharedSecret)
    }

    console.log(secretKey)
    const tx = await atomicCloak.close(swapId, secretKey)
    console.log(tx)
  } else {
    setTimeout(() => closeSwap(swapId, swapData), 1000)
  }
}

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

  const swapId = await atomicCloak.commitmentToAddress(
    openSwapRequest.qx,
    openSwapRequest.qy
  )

  const mirrorSwapId = await atomicCloak.commitmentToAddress(qsx, qsy)

  console.log('swapId:', swapId, 'from', openSwapRequest.qx, openSwapRequest.qy)

  const blockNumberBefore = await provider.getBlockNumber()
  const timestampBefore = (await provider.getBlock(blockNumberBefore)).timestamp
  const timestamp = timestampBefore + 180
  swapDB[swapId.toString('hex')] = {
    timelock: timestamp,
    tokenContract: '0x',
    value: `${openSwapRequest.value}`,
    sender: signer.address,
    recipient: openSwapRequest.addressTo,
    sendingChainID: openSwapRequest.sendingChainID,
    receivingChainID: openSwapRequest.receivingChainID,
    mirrorSwapId: mirrorSwapId,
    sharedSecret: openSwapRequest.z
  }

  const gasPrice = provider.getGasPrice()

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
}

export const getMirror = async (swapId: string) => {
  console.log('Requested swap ID', swapId, swapDB[swapId])
  const checkGraph = async (swapID: string) => {
    if (!swapDB[swapID]) {
      return null
    }
    console.log('GRAPH:', graphqlEndpoints[swapDB[swapID].receivingChainID])
    const response = await sendGraphqlRequest(
      graphqlEndpoints[swapDB[swapID].receivingChainID],
      `
      query Query ($swapID: String!) {
        opens(where: { _swapID: $swapID }) {
          _swapID
        }
      }`,
      { swapID: swapDB[swapID].mirrorSwapId }
    )
    console.log(response.data)
    return response.data.opens.length > 0
  }

  if (!swapId.startsWith('0x')) {
    if (await checkGraph(`0x${swapId}`)) {
      closeSwap(`0x${swapId}`, swapDB[`0x${swapId}`])
      return swapDB[`0x${swapId}`]
    }
    return null
  }

  if (await checkGraph(swapId)) {
    closeSwap(swapId, swapDB[swapId])
    return swapDB[swapId]
  }
  return null
}
