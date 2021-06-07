# Ethereum Matic Bridge

### About
Make use of a POS Ethereum-Matic bridge to move tokens between the mapped networks
Goerli testnet on Ethereum and Mumbai testnet on Polygon Matic Network.
To understand how tokens are mapped to each other visit [Mapped Tokens at Matic documentation](https://docs.matic.network/docs/develop/network-details/mapped-tokens)

### Get started

1. Install packages
```sh
$ npm install 
```

2. Connect Metamask Polygon Matic Mumbai testnet by adding custom network if not already done so
<img src="./ImagesReadMe/mumbai.png" alt="configure Polygon Matic Mumbai Testne" width="200"/>
Connect to Goerli Test Network by selecting Goerli network from the Networks dropdown in Metamask


3. Get DummyERC20 (DERC20) tokens on Goerli testnet from [https://faucet.matic.network/](https://faucet.matic.network/)
<img src="./ImagesReadMe/derc20.png" alt="configure Polygon Matic Mumbai Testne" width="200"/>



3. Run code
```sh
$ node index.js