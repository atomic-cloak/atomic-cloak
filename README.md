<p align="center">
  <img src="graphics/logo.png">
</p>

**_Atomic Cloak._** _Mixer-style privacy preserving cross-chain atomic swaps. Withdraw ETH and ERC-20 from L2 anonymously and instantly via a liquidity provider._

# Idea

## Rationale

### TL;DR:

Problem:

1. Slow or centralized withdrawals from optimistic L2;
2. Everlasting desire for token anonymization tools.

Solution: Atomic swaps using Schnorr-locked time contracts.

### Problem

ETH and ERC-20 token transfers between L2s and L1 have several limitations. For optimistic rollups, a user must choose among two evils: either to wait for long withdrawal period or rely on a centralized cross-chain service.

ZK rollups offer a much better deal in theory: tokens could be withdrawn as fast as a ZK proof is generated and verified and the technology can be used to provide a native privacy protection. However, in practice current ZK-rollups are still not instant (e.g. zkSync waits for 1 day to be on the safe side), and they face pressure from governments to avoid any anonymization functionality.

### Solution

Atomic swaps based on Hash Timelocked Contracts are a well-know beast in the crypto community. The cryptography of HTLC allows two peers to atomically exchange assets (either each gets what they want or nobody gets anything), and no trust is needed. (see Section 3.1 [here](https://eprint.iacr.org/2019/896.pdf)) The cryptographical core of the algorithm can facilitate asset exchange across different chains.

Our solution extends the idea of HTLC to Schnorr Timelocked Contracts, based on [this paper](https://fc20.ifca.ai/wtsc/WTSC2020/WTSC20_paper_20.pdf). Main idea: the hash function is chosen so the opening commitments on two different contracts can not be linked by a third party. Ether and ERC-20 can be swapped using the contract.

The privacy-protection of Atomic Cloak is based on a mixer + account abstraction. From the outside, STLC counterparties cannot be identified and all requests created at the same time cannot be distinguished from other requests of the same value tier. Also it is impossible to determine the destination chain of tokens, so several cross-chain swaps with random wait times can obfuscate token sender very well.

### Liquidity Provision

The Atomic Cloak protocol is agnostic to how the swap counterparties agree on the swap, this logic happens off-chain in the UI. Also the fee tiers are not enforces on the protocol level, but only on the UI level.

For simplicity, our web interface implements a swap liquidity provider: an entity that hold liquidity on different chains and always accepts swap requests. It is possible to design different ways to find a swap party, but it necessarily must include a secure communication channel for cryptography reasons. In our solution, such channel is communication between UI frontend and backend.

## Specification

### Cryptography

The privacy and atomicity of Atomic Cloak relies on the [discrete log problem](https://en.wikipedia.org/wiki/Discrete_logarithm), the same cryptography that protects Ethereum secret keys. The protocol is similar to Schnorr signature with an empty message hash.

0. Alice and Bob agree for a swap.
1. Alice chooses a secret key $s_A \in Z^*_q$ and computes $Q_A = G^{s_A}$, where $G$ is the generator of `secp256k1` elliptic curve group. Note that $s_A$ can not be recoveref from $Q_A$.
2. Alice creates an atomic swap with Bob by locking tokens in a contract. Tokens can be withdrawn:
    - either by Bob after presenting $s_A$, or
    - after timeout period by Alice.
3. Alice generates random $z\in Z^*_q$ and sends it together with her preferred receiving address to Bob.
4. Bob computes $Q_B = Q_A G^z$ and creates an atomic swap with Alice's receiving address. The timeout must be shorter than on Alice's contract.
5. At this point Alice can compute $Q_B$ and withdraw from Bob's contract by presenting $s_B = s_A + z$, since $G^{s_B} = Q_B$. In doing so, she reveals $s_B$.
6. Bob can now compute $s_A = s_B - z$ and withdraw from Alice's contract.

### Atomic Cloak swap flows

---

**Execution flow of a successful Atomic Cloak swap:**
![](graphics/AtomicCloak_success.svg)

---

**Execution flow of a timed out Atomic Cloak swap:**
![](graphics/AtomicCloak_fail.svg)

## Challenges

We faced several challenges :

1. Efficiently implementing cryptography for Schnorr Timelocked Contracts.
2. Indexing all relevant on-chain events (opening and closing) to provide a comfortable UI.
3. Closing an anonymized swap could still be tracked to the gas payer and thus to the closer.
4. Gas-efficiently opening many STLCs for liquidity providers.
5. Deploying AtomicCloak contract to different chains with the same address.

**Solution to 1**: Abuse `ecrecover` opcode to multiply an EC point with a scalar as explained [here](https://ethresear.ch/t/you-can-kinda-abuse-ecrecover-to-do-ecmul-in-secp256k1-today/2384/4).

**Solution to 2**: use The Graph to listen to emitted events.

**Solution to 3**: account abstraction. Using [EIP-4337][https://eips.ethereum.org/EIPS/eip-4337] protocol, the SLT contract itself can pay swap closure fee for a small fraction of the swap amount. To close a swap, a user can create a UserOperation with the reveal data, and can withdraw tokens to a fresh empty account. Note that a user can also close with a transaction (e.g. to use on chains with no AA features), but this will provide risks for privacy.

**Solution to 4**: account abstraction. We use transaction batching feature of EIP-4337 to open many atomic swaps with a single transaction.

**Solution to 5**: deploy everything via factories that use `CREATE2` opcode.

## Future ideas

At ETHPrague, Atomic Cloak is just a minimal proof of concept. However we believe in the value of the project and suggest the following improvements to make it production-ready.

1. **Implement LP tokenomics.** Design a fair and transparent fee system to allow liquidity providers collect a portion of the swap amount. This fee should incentivize users to accept atomic swaps instantly if they have liquidity on different chains and pay fees for "slow" bridges between the networks to equalize liquidity distribution.
2. **Decentralize.** Create a UI to find atomic swap peers and exchange secret information in an encrypted channel. Allow liquidity provider registration to support instant swaps.
3. **Allow token exchange.** Allow opening contracts hold different tokens (e.g. different ERC-20, or ether and ERC-20), as agreed off-chain by peers. This would further boost privacy and allow token exchange functionality.
4. **Add Noise Creators.** To boost privacy, create a service to create noise swaps. Noise creators will open and close swaps among different chains, so other swaps could be obfuscated among the noise.
5. **Do general reveal of secret.** The protocol could be generalized beyond atomic token swaps by replacing the swap closing logic. In this way other atomic revals of secret could be implemented.

# Development

## Deployments

The instance of Atomic Cloak smart contract is deployed on following networks (to be updated):

| Networks           | Address                                      |   UI support    |  Close swap with UserOp    |
| ------------------ | -------------------------------------------- |-----------------|----------------------------|
| sepolia            | `0x6a18426245F240B95378a43769b5688B9794875b` |     Yes         |         No                 |
| mumbai             | `0xcE250A659fc1090714c2810ec091F7BB95D27eb4` |     Yes         |         Yes                |
| optimism goerli    | `0x272e066945678DeB96736a1904734cdFdFF074c6` |     Yes         |         Yes                |
| zkSync era testnet | `0x...`                                      |                 |                            |
| mantle             | `0xC0E46AC8E2db831D0D634B8a9b0A5f32fB99c61d` |     No          |         No                 |

## Account abstraction features

Atomic Cloak project uses two account abstraction features.

1. An instance of Atomic Cloak is also an account abstraction [BaseAccount](https://github.com/eth-infinitism/account-abstraction/blob/main/contracts/core/BaseAccount.sol) with a custom user operation verification logic. This is done so atomic swaps could be closed into a fresh account and the gas is paid from the swap tokens.
   The custom `_validateSignature` function checks the swap commitment opening and allows to close a swap once the corresponding secret is provided. There is no owner logic and no account with a special control of Atomic Cloak contract funds.
2. Liquidity provider holds funds in a [SimpleAccount](https://github.com/eth-infinitism/account-abstraction/blob/main/contracts/samples/SimpleAccount.sol) and can use transaction batching functionality to open multiple swaps at the same time. There are two benefits:
    - gas optimization: submit one transaction instead of several;
    - further privacy protection: LP can collect opening requests for some period of time, shuffle them and open all swaps in a single transaction. This will further obfuscate the order and timing of swap requests.

## Current limitations

-   Currently we do not support `redeemExpiredSwap` handling in UI. Expired swaps have to be claimed by submitting transactions directly.
-   Although the Atomic Cloak smart contract supports the ERC-20 atomic swaps, this functionality was not thoroughly tested. Additionally, account abstraction swap close is available only for ether atomic swaps.
-   Once expired, liquidity provider has to close a swap as soon as possible. Otherwise their counterparty can burn the tokens as gas fees by calling `close` using `userOp`. This happens because `validateUserOp` cannot access the last block timestamp to check whether a swap expired.
-   Currently liquidity provider does not batch swap openings, it provides only single openings. However, the smart contracts include all necessary code.
