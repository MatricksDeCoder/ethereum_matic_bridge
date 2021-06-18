const MaticPOSClient = require('@maticnetwork/maticjs').MaticPOSClient
const HDWalletProvider = require('@truffle/hdwallet-provider')
// const WebSocket = require("ws");
const Web3 = require('web3')
require('dotenv').config()
const open = require('open');

const web3 = new Web3()
// providers Goerli
const privateKey = process.env.PRIVATE_KEY || ""
const infuraURI = process.env.INFURA_URI || ""
const providerGoerli = new Web3.providers.HttpProvider(infuraURI)
const web3_parent = new Web3(providerGoerli)
const parentProvider = new HDWalletProvider(privateKey, infuraURI) // Ethereum Georli testnet network
// providers Mumbai
const mumbaiURI = 'https://rpc-mumbai.matic.today'
const providerMumbai = new Web3.providers.HttpProvider(mumbaiURI)
const web3_child = new Web3(providerMumbai)
const maticProvider = new HDWalletProvider(privateKey, mumbaiURI) // Polygon Matic Mumbai testnet network

// For Contract Addresses visit https://docs.matic.network/docs/develop/network-details/mapped-tokens 
const account = '0xFc0BBFE1e6391Ad733B0016d41E50cFa2725717E' // replace with your account with privateKey in .env
const parentAddressGoerli = '0x655F2166b0709cd575202630952D71E2bB0d61Af' // DERC20 Goerli
const childAddressMumbai = '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1'  // DERC20 Mumbai

// miniABI for token
const miniABI = [ //Stripped ABI for tokens
  // balanceOf
  {
    "constant":true,
    "inputs":[{"internalType":"address","name":"owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "payable":false,
    "stateMutability":"view",
    "type":"function"
  }
]

// DERC20 token reference Goerli and Mumbai
const tokenRefDERC20Goerli = new web3_parent.eth.Contract(miniABI,parentAddressGoerli)
const tokenRefDERC20Mumbai = new web3_child.eth.Contract(miniABI,childAddressMumbai)

const maticPOSClient = new MaticPOSClient({
    network: "testnet",
    version: "mumbai",
    parentProvider,
    maticProvider
});

// helper functions
const toBN = (value) => new web3.utils.toBN(value)
const toWei = (stringValue) => web3.utils.toWei(stringValue, 'ether')
const fromWei = (stringValue) => web3.utils.fromWei(stringValue, 'ether')
const balanceGoerli = async(account) => await tokenRefDERC20Goerli.methods.balanceOf(account).call()
const balanceMumbai = async(account) => await tokenRefDERC20Mumbai.methods.balanceOf(account).call()
const balances = async(account) => {
  const goerli = await balanceGoerli(account)
  const mumbai = await balanceMumbai(account)
  console.log(`Balances DREC20 Goerli : ${fromWei(goerli)}`)
  console.log(`Balances DREC20 Mumbai : ${fromWei(mumbai)}`)
}
const goerliExplorer = 'https://goerli.etherscan.io/'
const mumbaiExplorer = 'https://explorer-mumbai.maticvigil.com/'
const openGoerliExplorer = (account) => open(`${goerliExplorer}/address/${account}`)
const openMumbaiExplorer = (account) => open(`${mumbaiExplorer}/address/${account}`)

// constants
const amount = '0.01' 
const DERC20_To_Send = 'DERC20 Tokens to send: '
const Transferring = 'Transferring tokens using bridge! Goerli-> Mumbai! Process may take some time...'
const rootApproved = 'rootTokenAddress approved to enable token deposit'
const tokensMoved = 'Deposit called & Deposit completed. Tokens available on Mumbai'
const checkingDeposit = 'Checking for deposit in Mumbai network...........'
const transferringBack = 'Transferring back tokens; reverse process using bridge! Mumbai -> Goerli! Process may take some time...'


// can take very long; may have problems with polling if using infura node
// check average gas price https://explorer.bitquery.io/goerli/gas 
const init = async () => {
  console.log(Transferring)
  // amount of token to send
  const tokensAmount = toBN(toWei(amount))
  console.log(DERC20_To_Send + amount)
  // initial start balances
  await balances(account)
  // Approve tokens
  let tx
  try {
    tx = await maticPOSClient.approveERC20ForDeposit(parentAddressGoerli, tokensAmount, { from: account,gasPrice: "800000000000"})
    console.log(`\nTransaction hash ${tx.transactionHash}`)
    await new Promise(resolve => setTimeout(resolve, 120000)); // wait 2 minutes
    console.log(rootApproved)
  } catch(error) {
    console.log(error)
  }
  try {
    // variable to track and wait for balance to update in Matic Mumbai network
    let oldBalance = await balanceMumbai(account)
    let newBalance = oldBalance
    tx = await maticPOSClient.depositERC20ForUser(parentAddressGoerli, account, tokensAmount, {from: account, gasPrice: "800000000000"})
    console.log(`\nTransaction hash ${tx.transactionHash}`)
    while(oldBalance === newBalance) {
      console.log(checkingDeposit)
      newBalance = await balanceMumbai(account)
      await new Promise(resolve => setTimeout(resolve, 180000)); //check for update every 3 minutes
    }
    console.log(tokensMoved)
  } catch(error) {
    console.log(error)
  }
  await balances(account)
  openGoerliExplorer(account) 
  openMumbaiExplorer(account)
  // Reverse the process! Transfer tokens back from Mumbai to Goerli on deposit success
  console.log(transferringBack)
  try {
    tx = await maticPOSClient.burnERC20(childAddressMumbai, tokensAmount, {from: account})
    console.log(`\nTransaction hash ${tx.transactionHash}`)
    await maticPOSClient.exitERC20(tx.transactionHash, { from: account})
  } catch(error) {
    console.log(error)
  }
  await balances(account)
  
}

init()




  