import { createPublicClient, http } from 'viem';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { arbitrumSepolia } from 'viem/chains';
import {
  prepareChainConfig,
  createRollupPrepareDeploymentParamsConfig,
  createRollup,
} from '@arbitrum/orbit-sdk';
import { sanitizePrivateKey, generateChainId } from '@arbitrum/orbit-sdk/utils';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

// Code below based on the following example: https://github.com/OffchainLabs/arbitrum-orbit-sdk/tree/main/examples/create-rollup-eth

// Environment variable validation
const requiredEnvVars = {
  PARENT_CHAIN_RPC: process.env.PARENT_CHAIN_RPC,
  DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY,
} as const;

// generate a random batch poster account
const batchPosterPrivateKey = generatePrivateKey();
const batchPoster = privateKeyToAccount(batchPosterPrivateKey).address;

// generate a random validator account
const validatorPrivateKey = generatePrivateKey();
const validator = privateKeyToAccount(validatorPrivateKey).address;

// set the parent chain and create a public client for it
const parentChain = arbitrumSepolia;
const parentChainPublicClient = createPublicClient({
  chain: parentChain,
  transport: http(requiredEnvVars.PARENT_CHAIN_RPC as string),
});

// load the deployer account
const deployer = privateKeyToAccount(sanitizePrivateKey(requiredEnvVars.DEPLOYER_PRIVATE_KEY as string));

async function main() {
  // generate a random chain id
  const chainId = generateChainId();

  const createRollupConfig = createRollupPrepareDeploymentParamsConfig(parentChainPublicClient, {
    chainId: BigInt(chainId),
    owner: deployer.address,
    chainConfig: prepareChainConfig({
      chainId,
      arbitrum: {
        InitialChainOwner: deployer.address,
        //false will make this chain a rollup and use Ethereum as the Data Availabilty layer. Change to true to use a Data Availability Committee (DAC) instead
        DataAvailabilityCommittee: false,
      },
    }),
  });

  try {
    await createRollup({
      params: {
        config: createRollupConfig,
        batchPosters: [batchPoster],
        validators: [validator],
      },
      account: deployer,
      parentChainPublicClient,
    });
  } catch (error) {
    console.error(`Rollup creation failed with error: ${error}`);
  }
}

main();