// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    // Auction state
    address payable public seller;
    string public itemName;
    uint public startPrice;
    uint public auctionEndTime;
    bool public ended;

    address public highestBidder;
    uint public highestBid;

    // Mapping to track pending returns for outbid participants
    mapping(address => uint) public pendingReturns;

    event AuctionStarted(string itemName, uint startPrice, uint duration);
    event NewBid(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    constructor(string memory _itemName, uint _startPrice, uint _durationMinutes) {
        seller = payable(msg.sender);
        itemName = _itemName;
        startPrice = _startPrice;
        auctionEndTime = block.timestamp + (_durationMinutes * 1 minutes);
        emit AuctionStarted(itemName, startPrice, _durationMinutes);
    }

    // Bid function
    function bid() public payable {
        require(block.timestamp < auctionEndTime, "Auction has ended.");
        require(msg.value > highestBid, "There already is a higher or equal bid.");

        // Refund the previous highest bidder
        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }

        // Update highest bid
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit NewBid(msg.sender, msg.value);
    }

    // Withdraw overbid funds
    function withdraw() public {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw.");

        pendingReturns[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed.");
    }

    // End the auction
    function endAuction() public {
        require(block.timestamp >= auctionEndTime, "Auction is still ongoing.");
        require(!ended, "Auction has already ended.");
        require(msg.sender == seller, "Only the seller can end the auction.");

        ended = true;

        // Transfer funds to seller
        (bool success, ) = seller.call{value: highestBid}("");
        require(success, "Transfer to seller failed.");

        emit AuctionEnded(highestBidder, highestBid);
    }
}
