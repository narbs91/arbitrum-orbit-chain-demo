import { createPublicClient, http } from 'viem';
import {
  createRollupPrepareTransaction,
  createRollupPrepareTransactionReceipt,
  ChainConfig,
  prepareNodeConfig,
} from '@arbitrum/orbit-sdk';
import { arbitrumSepolia } from 'viem/chains';
import { generatePrivateKey } from 'viem/accounts';
import * as fs from 'fs';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

// Code below based on the following example: https://github.com/OffchainLabs/arbitrum-orbit-sdk/tree/main/examples/prepare-node-config

if (typeof process.env.DEPLOYER_PRIVATE_KEY === 'undefined') {
  throw new Error(`Please provide the "DEPLOYER_PRIVATE_KEY" environment variable`);
}

if (typeof process.env.PARENT_CHAIN_RPC === 'undefined' || process.env.PARENT_CHAIN_RPC === '') {
  console.warn(
    `Warning: you may encounter timeout errors while running the script with the default rpc endpoint. Please provide the "PARENT_CHAIN_RPC" environment variable instead.`,
  );
}

// load or generate a random batch poster account
const batchPosterPrivateKey = generatePrivateKey();

// load or generate a random validator account
const validatorPrivateKey = generatePrivateKey();

// Transaction hash of the deployed Orbit chain contracts
const transactionHash = process.env.ORBIT_CHAIN_DEPLOYED_TX_HASH as `0x${string}`;

// Define the parent chain
const parentChain = arbitrumSepolia;

const parentChainPublicClient = createPublicClient({
  chain: parentChain,
  transport: http(process.env.PARENT_CHAIN_RPC),
});

// get the transaction
const tx = createRollupPrepareTransaction(
   await parentChainPublicClient.getTransaction({ hash: transactionHash }),
);

// get the transaction receipt
const txReceipt = createRollupPrepareTransactionReceipt(
  await parentChainPublicClient.getTransactionReceipt({ hash: transactionHash }),
);

// get the chain config and core contracts
const config = tx.getInputs()[0].config;
const chainConfig: ChainConfig = JSON.parse(config.chainConfig);
const coreContracts = txReceipt.getCoreContracts();

const nodeConfig = prepareNodeConfig({
  chainName: 'DevChain',
  chainConfig,
  coreContracts,
  batchPosterPrivateKey,
  validatorPrivateKey,
  stakeToken: config.stakeToken,
  parentChainId: parentChain.id,
  parentChainRpcUrl: parentChain.rpcUrls.default.http[0],
});

// Save the node config to a file
fs.writeFileSync('orbit-node/nodeConfig.json', JSON.stringify(nodeConfig, null, 2));