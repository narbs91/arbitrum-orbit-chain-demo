deploy-chain:
	yarn run dev:deploy-chain

node-config:
	yarn run dev:node-config

run-chain:
	docker run --rm -it \
		-v orbit-node-devchain:/home/user/.arbitrum \
		-p 0.0.0.0:8547:8547 \
		-p 0.0.0.0:8548:8548 \
		offchainlabs/nitro-node:v3.6.5-89cef87 \
		--chain.name="DevChain" \
		--chain.info-json="[{\"chain-id\":12953300305,\"parent-chain-id\":421614,\"parent-chain-is-arbitrum\":true,\"chain-name\":\"DevChain\",\"chain-config\":{\"homesteadBlock\":0,\"daoForkBlock\":null,\"daoForkSupport\":true,\"eip150Block\":0,\"eip150Hash\":\"0x0000000000000000000000000000000000000000000000000000000000000000\",\"eip155Block\":0,\"eip158Block\":0,\"byzantiumBlock\":0,\"constantinopleBlock\":0,\"petersburgBlock\":0,\"istanbulBlock\":0,\"muirGlacierBlock\":0,\"berlinBlock\":0,\"londonBlock\":0,\"clique\":{\"period\":0,\"epoch\":0},\"arbitrum\":{\"EnableArbOS\":true,\"AllowDebugPrecompiles\":false,\"DataAvailabilityCommittee\":false,\"InitialArbOSVersion\":32,\"GenesisBlockNum\":0,\"MaxCodeSize\":24576,\"MaxInitCodeSize\":49152,\"InitialChainOwner\":\"0x5E449Ba5d13bfaEDE64A08e0d305f99CE2fd20Df\"},\"chainId\":12953300305},\"rollup\":{\"bridge\":\"0xB1e2eB3E7f4fCDe50BD79401Ea99e33aE1FD639e\",\"inbox\":\"0x32aa74795c63D8e52CC60793BDdEc90D9435c2D9\",\"sequencer-inbox\":\"0x22D92e24Dbe965682870E4Ea6B36e8E87B426146\",\"rollup\":\"0x8B943f2E67bE420597e05754eDae0975fB2F2170\",\"validator-wallet-creator\":\"0x2c37dCBCE3fbe32c9Ba62892F1E41DbB023BB62b\",\"stake-token\":\"0x980B62Da83eFf3D4576C647993b0c1D7faf17c73\",\"deployed-at\":177985184}}]" \
		--parent-chain.connection.url="https://sepolia-rollup.arbitrum.io/rpc" \
		--execution.forwarding-target=null \
		--node.staker.enable=false \
		--node.staker.dangerous.without-block-validator=true \
		--http.api=net,web3,eth,arb \
		--http.corsdomain="*" \
		--http.addr="0.0.0.0" \
		--http.port=8547 \
		--http.vhosts="*"