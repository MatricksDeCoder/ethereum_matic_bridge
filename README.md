# Ethereum Matic Bridge
Move DERC20 tokens Dummy ERC20 tokens from Ethereum Goerli testnet to Polygon Mumbai testnet using POS Bridge
You will need DERC20 tokens in an account you control(have privat key for) e.g a Metamask account. We will get DERC20 tokens from faucet https://faucet.matic.network/ into a Metamask Account. Copy Metamask address and request DERC20. 

Select Token: POS (ERC20 ). Select Network: Goerli. Click Submit. Copy Token Address. Click Confirm! See image below

<img src="./ImagesReadMe/derc20.png" alt="Request DERC20 Tokens" width="300"/>
Add DERC20 Asset to your Metamask to view the balance of your DERC20. After a while check your Metamask to see new balance DERC20 Tokens

### About

Make use of a POS Ethereum-Matic bridge to move tokens between the mapped networks
Goerli testnet on Ethereum and Mumbai testnet on Polygon Matic Network.
To move Ethereum you need to connect with Polygon Mainnet , this example will use Goerli to Mumbai and reverse
To view [Mapped Tokens at Matic documentation](https://docs.matic.network/docs/develop/network-details/mapped-tokens)
To view [Matic Documentation](https://docs.matic.network/docs/develop/ethereum-matic/pos/using-sdk/erc20)

For information on POS and Plasma deposit and withdrawal timelines, token types etc 
[Visit Docs](https://docs.matic.network/docs/develop/ethereum-matic/getting-started)

### Get started

1. Install packages
```sh
$ npm install 
```

2. Run code
```sh
$ node index.js
```

### To do

- Use events to listen for events deposit using bridge
- Plasma Bridge transfers between chains