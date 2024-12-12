# Auction DApp - Solidity Smart Contract and React Frontend

This project is a decentralized auction platform implemented using a Solidity smart contract and a React frontend. It allows users to bid on items, withdraw funds, and manage auctions in a transparent and secure way.

## Table of Contents
- [Installation](#installation)
- [Overview](#overview)
- [Usage](#usage)
  - [Start the Auction](#start-the-auction)
  - [Submit a Bid](#submit-a-bid)
  - [Withdraw Funds](#withdraw-funds)
  - [End the Auction](#end-the-auction)
  - [Fetch Auction Details](#fetch-auction-details)
- [Functions](#functions)
  - [Solidity Functions](#solidity-functions)
  - [React Functions](#react-functions)
- [Example Outputs](#example-outputs)
- [Extra Tasks](#extra-tasks)

## Installation

### Prerequisites
- Node.js and npm
- MetaMask browser extension
- Ethereum development environment (e.g., Hardhat, Ganache, or Infura)

### Setup
1. Clone or download this repository.
2. Navigate to the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Deploy the smart contract using Hardhat or Remix and update `AuctionContractAddress` in `App.js`.
5. Start the development server:
   ```bash
   npm start
   ```

## Overview
This decentralized application includes:

- **Solidity Smart Contract:** Defines the auction logic, bid management, withdrawal process, and auction closure.
- **React Frontend:** Provides an interactive UI to manage and participate in auctions.

### Smart Contract Classes
- **Auction:** Manages the auction lifecycle, including bidding, withdrawals, and auction finalization.
- **Events:** Tracks auction events such as bids, withdrawals, and auction endings.

### React Frontend Features
- Connect MetaMask Wallet
- Place Bids and Track Auction Status
- Withdraw Pending Returns
- End Auction if Authorized

## Usage

### Start the Auction
1. Deploy the smart contract.
2. Provide auction details (item name, starting price, and duration).

### Submit a Bid
1. Connect your MetaMask wallet.
2. Enter the bid amount in ETH and submit.

### Withdraw Funds
1. If your bid is outbid, use the "Withdraw" button to reclaim funds.

### End the Auction
1. Only the seller can end the auction after the auction duration.

### Fetch Auction Details
- The auction details, including the highest bid and bidder, are displayed automatically after connecting MetaMask.

## Functions

### Solidity Functions

#### `bid()`
- Allows users to place bids higher than the current highest bid.

#### `withdraw()`
- Enables users to withdraw funds if they have been outbid.

#### `endAuction()`
- Ends the auction and transfers the highest bid amount to the seller.

#### `getAuctionDetails()`
- Fetches auction details such as item name, starting price, auction status, highest bid, and bidder.

#### `getPendingReturns(address bidder)`
- Returns the pending amount for a given bidder.

### React Functions

#### `initializeProvider()`
- Initializes the MetaMask provider and contract instance.

#### `requestAccount()`
- Connects the user’s MetaMask wallet.

#### `fetchAuctionDetails()`
- Fetches current auction details from the smart contract.

#### `fetchMyPendingReturns()`
- Retrieves the user’s pending returns from the contract.

#### `submitBid(event)`
- Submits a bid to the auction.

#### `endAuction(event)`
- Ends the auction if the user is the seller.

#### `withdraw()`
- Withdraws pending returns for the connected account.

## Example Outputs

### Auction Details Display
- Connected Account: `0x...`
- Pending Returns: `0.5 ETH`
- Auction Item: `Antique Vase`
- Start Price: `1.0 ETH`
- Auction End Time: `2024-12-15 12:00 PM`
- Highest Bid: `2.5 ETH`
- Highest Bidder: `0x...`

## Extra Tasks

### Deploy on a Testnet
    I deployed this smart contract under the Holešky ethereum testnet you can view it here: https://holesky.etherscan.io/address/0x6a9a716357997c960eb547523c01182eff0848b6

---

Enjoy participating in decentralized auctions with this DApp! 🚀

