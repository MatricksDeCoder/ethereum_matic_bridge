import { MaticPOSClient } from '@maticnetwork/maticjs'
require('dotenv').config();
const infuraURI = process.env.INFURA_URI || ""

const parentProvider = infuraURI // Ethereum Georli testnet network
const childProvider = 'https://rpc-mumbai.matic.today' // Polygon Matic Mumbai testnet network

// Contract Addresses
const rootManagerAddressGoerli = '0x655F2166b0709cd575202630952D71E2bB0d61Af'
const childManagerAddressMumbai = '0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1'




  const amount = '1000000000000000000'

const mumbaiClientFromETH = new MaticPOSClient({
    network: "testnet",
    version: "mumbai",
    parentProvider: window.ethereum,
    maticProvider: childProvider
});

const mumbaiClientToETH = new MaticPOSClient({
    network: "testnet",
    version: "mumbai",
    parentProvider,
    maticProvider: window.ethereum
});

console.log("Move tokens between Ethereum Goerli Testnet and Polygon Matic Mumbai Testnet")

const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
})






  const handleApprove = async () => {
    await parentMaticPOSClient.approveERC20ForDeposit(rootTokenAddress, amount, { from: account })
  }

  const handleDeposit = async () => {
    await parentMaticPOSClient.depositERC20ForUser(rootTokenAddress, account, amount, {
      from: account,
      gasPrice: '10000000000',
    })
  }

  const handleBurn = async () => {
    const burnTxHash = await childMaticPOSClient.burnERC20(childTokenAddress, amount, { from: account })
    alert('Copy this transaction hash: ' + burnTxHash.transactionHash)
  }

  const handleExit = async () => {
    await parentMaticPOSClient.exitERC20(burnTxHash, { from: account, fastProof: true })
  }

  return (
    <div className="App">
      <h1 className="title">Polygon Matic bridge functions</h1>
      <div className="cards">
        <div className="card">
          <h2>ETH {'>'} Matic</h2>
          <div>
            <button onClick={handleApprove}>Approve</button>
            <button onClick={handleDeposit}>Deposit</button>
          </div>
        </div>
        <div className="card">
          <h2>Matic {">"} ETH</h2>
          <input
            type="text"
            onChange={(event) => setBurnTxHash(event.target.value)}
            value={burnTxHash}
            placeholder="Paste burn tx hash here" />
          <div>
            <button onClick={handleBurn}>Burn</button>
            <button onClick={handleExit}>Exit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;