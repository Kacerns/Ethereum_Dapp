import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";

// ABI and contract address
const auctionABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_itemName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_startPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_durationMinutes",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "AuctionEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "itemName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "AuctionStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "bidder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "NewBid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "bidder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "bid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAuctionDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bidder",
        "type": "address"
      }
    ],
    "name": "getPendingReturns",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getSeller",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
const contractAddress = "0x0Fa2ff5E934B69496280d3A8E9E9a2A0EDF4Be2E"; // Replace with your contract's deployed address

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const [auctionEnded, setAuctionEnded] = useState(false);

  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        await tempProvider.send("eth_requestAccounts", []);
        const tempSigner = tempProvider.getSigner();
        const tempContract = new ethers.Contract(contractAddress, auctionABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
      } else {
        alert("Please install MetaMask to use this dApp.");
      }
    }
    connectWallet();
  }, []);

  useEffect(() => {
    async function fetchAuctionData() {
      if (contract) {
        const highestBid = await contract.highestBid();
        const highestBidder = await contract.highestBidder();
        const auctionEndTime = await contract.auctionEndTime();
        const currentTime = Math.floor(Date.now() / 1000);

        setHighestBid(ethers.utils.formatEther(highestBid));
        setHighestBidder(highestBidder);
        setAuctionEnded(currentTime > auctionEndTime);
      }
    }
    fetchAuctionData();
  }, [contract]);

  const placeBid = async () => {
    try {
      const tx = await contract.bid({ value: ethers.utils.parseEther(bidAmount) });
      await tx.wait();
      alert("Bid placed successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const endAuction = async () => {
    try {
      const tx = await contract.endAuction();
      await tx.wait();
      alert("Auction ended successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Auction dApp</h1>
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Auction Details</h5>
          <p><strong>Highest Bid:</strong> {highestBid} ETH</p>
          <p><strong>Highest Bidder:</strong> {highestBidder}</p>
          <p><strong>Auction Ended:</strong> {auctionEnded ? "Yes" : "No"}</p>
        </div>
      </div>

      <div className="mt-4">
        <h5>Place a Bid</h5>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Bid amount in ETH"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-2" onClick={placeBid} disabled={auctionEnded}>
          Place Bid
        </button>
      </div>

      {signer && (
        <div className="mt-4">
          <button className="btn btn-danger" onClick={endAuction} disabled={!auctionEnded}>
            End Auction
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
