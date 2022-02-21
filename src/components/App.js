import React, { Component } from 'react';
import daiLogo from '../dai-logo.png';
import './App.css';
import Web3 from 'web3';
import DaiTokenMock from '../abis/DaiTokenMock.json'

class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    // Establish connection to web3
    const web3 = window.web3
    // Log web3 to check valid connection
    console.log(web3)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log("account #1", accounts[0])

    const daiTokenAddress = "0x4BBAA009c5dd0A07CDcac11F8ffB87c44Ce84Ad6"
    const daiTokenMock = new web3.eth.Contract(DaiTokenMock.abi, daiTokenAddress)
    this.setState({ daiTokenMock: daiTokenMock })
    console.log(this.state.daiTokenMock)

    const balance = await daiTokenMock.methods.balanceOf(this.state.account).call()
    this.setState({ balance: web3.utils.fromWei(balance.toString(), 'Ether') })
    console.log(web3.utils.fromWei(balance.toString(), 'Ether'), "Ether")
    // Fetch transaction history (all outgoing transactions)
    // "Fetch all 'Transfer' events fromBlock 0 to latest (from entire blockchain), and filter them to only show transactions FROM the connected account"
    const transactions = await daiTokenMock.getPastEvents('Transfer', { fromBlock: 0, toBlock: 'latest', filter: { from: this.state.account } })
    this.setState({ transactions: transactions })
    // Print events
    console.log(transactions)
    console.log(this.state)
  } 

  // Pass in both args for the ERC20 function to execute (we grab these from the onSubmit in the form below)
  transfer(recipient, amount) {
    // Call the transfer() function from the contract
    // Pass in the same args
    // We have to call .send() as well as the function itself
    // We .send({ from: the account that must sign for this transaction to execute })
    this.state.daiTokenMock.methods.transfer(recipient, amount).send({ from: this.state.account })
  }


  constructor(props) {
    super(props);
    this.state = {
      // Store account as empty string
      account: '',
      // Store daiTokenMock smart contract
      // Required to be lowercase ⁉️
      daiTokenMock: null,
      // Store users' balance
      balance: 0,
      // Store their entire transaction history
        // Can display on clientside
      transactions: []
    }
    // In JavaScript, class methods are not bound by default - Therefore, it’s necessary to bind functions to the class instance
      // We bind the transfer function to our 'class App extends Component' in our constructor method
      // Because the binding() line of code is inside the constructor, "this" is an instance of the class itself
      // Thus when transfer() is called in the DOM, our app still knows what "this" should be
    // The bind() method allows us to easily set which object will be bound by the "this" keyword when a function or method is invoked
    // We put it in the constructor because
    this.transfer = this.transfer.bind(this)
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
       
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{ width: "400px" }}>
                
                <img src={daiLogo} width="150" />
                
                <h1>{this.state.balance} DAI</h1>
                <form onSubmit={(event) => {
                  // Prevent page from refreshing (the default browser behavior)
                  event.preventDefault()
                  // Delare the recipient to grab and send
                  const recipient = this.recipient.value
                  // Declare the amount to grab and send
                    // Covert amount to its decimal resolution (18)
                  const amount = window.web3.utils.toWei(this.amount.value, 'Ether')
                  // Call the transfer function inside of the transfer function
                  this.transfer(recipient, amount)
                  console.log(recipient, amount)
                }}>
                {/* Specify where the button will lead the user to */}
                <div className="form-group mr-sm-2">
                  <input 
                    id="recipient" 
                    type="text"
                    ref={(input) => { this.recipient = input }}
                    className="form-control"
                    placeholder="Recipient Address"
                    required />
                </div>
                <div className="form-group mr-sm-2">
                  <input 
                    id="amount" 
                    type="text"
                    ref={(input) => { this.amount = input }}
                    className="form-control"
                    placeholder="Amount"
                    required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Recipient</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>

                  <tbody>
                    { this.state.transactions.map((tx, index) => {
                      return(
                        <tr key={index}>
                          <td>{tx.returnValues.to}</td>
                          <td>{window.web3.utils.fromWei(tx.returnValues.value.toString(), 'Ether')}</td>
                        </tr>
                      )    
                    })}

                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
