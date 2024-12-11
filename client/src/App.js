import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { parseEther, formatEther } from '@ethersproject/units';
import Auction from './contracts/Auction.json';

const AuctionContractAddress = "0xF57173dc3734DcCd012ab38B921442F27892DC47";
const emptyAddress = '0x0000000000000000000000000000000000000000';

function App() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState(0);
  const [myPendingReturns, setMyPendingReturns] = useState(0);
  const [isSeller, setIsSeller] = useState(false);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState('');
  const [auctionDetails, setAuctionDetails] = useState({});

  async function initializeProvider() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(AuctionContractAddress, Auction.abi, signer);
  }
  

  async function requestAccount() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (e) {
        console.error("Error requesting account:", e);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this application.');
    }
  }

  async function fetchAuctionDetails() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await initializeProvider();
      try {
        const details = await contract.getAuctionDetails();
  
        setAuctionDetails({
          itemName: details[0],
          startPrice: Number(ethers.formatEther(details[1])),
          auctionEndTime: new Date(Number(details[2]) * 1000).toLocaleString(),
          ended: details[3],
          highestBidder: details[4].toLowerCase(),
          highestBid: Number(ethers.formatEther(details[5])).toFixed(4),
        });
      } catch (e) {
        console.error('Error fetching auction details:', e);
      }
    }
  }

  async function fetchMyPendingReturns() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await initializeProvider();
      try {
        const pendingReturns = await contract.getPendingReturns(account);
        setMyPendingReturns(parseFloat(formatEther(pendingReturns.toString())).toPrecision(4));
      } catch (e) {
        console.error('Error fetching pending returns:', e);
      }
    }
  }

  async function fetchSeller() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await initializeProvider();
      try {
        const seller = await contract.getSeller();
        setIsSeller(seller.toLowerCase() === account);
      } catch (e) {
        console.error('Error fetching seller:', e);
      }
    }
  }

  async function submitBid(event) {
    event.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      const contract = await initializeProvider();
      try {
        const wei = ethers.parseEther(amount.toString());
        
        console.log("Submitting bid with value:", wei.toString());
        console.log("Auction contract address:", AuctionContractAddress);
        
        const tx = await contract.bid({ value: wei });
        await tx.wait();
  
        await fetchAuctionDetails();
        await fetchMyPendingReturns();
      } catch (e) {
        console.error('Error making bid:', e);
      }
    }
  }
  async function endAuction(event) {
    event.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      const contract = await initializeProvider();
      try {

        const auctionEndTime = new Date(auctionDetails.auctionEndTime).getTime(); // Get the auction end time
        const currentTime = Date.now()

        console.log(auctionEndTime);
        console.log(currentTime);

        if(currentTime > auctionEndTime){
          await contract.endAuction();

          await fetchAuctionDetails();
          await fetchMyPendingReturns();
        }
        else{
          alert("The Auction has not yet Ended");
        }
        
      } catch (e) {
        console.error('Error ending auction:', e);
      }
    }
  }
  

  async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await initializeProvider();
      try {
        await contract.withdraw();
        await fetchMyPendingReturns();
      } catch (e) {
        console.error('Error withdrawing funds:', e);
      }
    }
  }

  useEffect(() => {
    requestAccount();
  }, []);

  useEffect(() => {
    if (account) {
      fetchSeller();
      fetchAuctionDetails();
      fetchMyPendingReturns();
    }
  }, [account]);

  return (
    <div style={{ textAlign: 'center', width: '50%', margin: '0 auto', marginTop: '100px' }}>
      {myPendingReturns > 0 ? (
        <button type="button" onClick={withdraw}>Withdraw</button>
      ) : null}

      <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '10px', border: '1px solid black' }}>
        <p>Connected Account: {account}</p>
        <p>Pending Returns: {myPendingReturns} ETH</p>
        <p>Auction Item: {auctionDetails.itemName}</p>
        <p>Start Price: {auctionDetails.startPrice} ETH</p>
        <p>Auction End Time: {auctionDetails.auctionEndTime}</p>
        <p>Auction Ended: {auctionDetails.ended ? 'Yes' : 'No'}</p>
        <p>Highest Bid: {auctionDetails.highestBid} ETH</p>
        <p>Highest Bidder: {auctionDetails.highestBidder === emptyAddress ? 'None' : auctionDetails.highestBidder === account ? 'Me' : auctionDetails.highestBidder}</p>

        {!isSeller && !auctionDetails.ended ? (
          <form onSubmit={submitBid}>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              name="Bid Amount"
              type="number"
              placeholder="Enter Bid Amount in ETH"
            />
            <button type="submit">Submit Bid</button>
          </form>
        ) : <button onClick={endAuction}>End Auction</button>}
      </div>
    </div>
  );
}

export default App;
