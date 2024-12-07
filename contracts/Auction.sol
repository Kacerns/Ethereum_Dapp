// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    address payable private immutable seller;
    string private itemName;
    uint private startPrice;
    uint private auctionEndTime;
    bool internal ended;

    address private highestBidder;
    uint private highestBid;

    mapping(address => uint) private pendingReturns;

    event AuctionStarted(string itemName, uint startPrice, uint duration);
    event NewBid(address indexed bidder, uint amount);
    event AuctionEnded(address indexed winner, uint amount);
    event Withdrawal(address indexed bidder, uint amount);

    constructor(string memory _itemName, uint _startPrice, uint _durationMinutes) {
        require(_durationMinutes > 0, "Auction duration must be greater than zero.");
        
        seller = payable(msg.sender);
        itemName = _itemName;
        startPrice = _startPrice;
        auctionEndTime = block.timestamp + (_durationMinutes * 1 minutes);

        emit AuctionStarted(itemName, startPrice, _durationMinutes);
    }

    function bid() external payable {
        require(msg.sender != seller, "Seller cannot bid on their own auction.");
        require(block.timestamp < auctionEndTime, "Auction has ended.");
        require(msg.value > highestBid, "There already is a higher or equal bid.");

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit NewBid(msg.sender, msg.value);
    }

    function withdraw() external {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw.");

        pendingReturns[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed.");

        emit Withdrawal(msg.sender, amount);
    }

    function endAuction() external {
        require(msg.sender == seller, "Only the seller can end the auction.");
        require(block.timestamp >= auctionEndTime, "Auction is still ongoing.");
        require(!ended, "Auction has already ended.");

        ended = true;

        uint finalAmount = highestBid;
        address winner = highestBidder;

        (bool success, ) = seller.call{value: finalAmount}("");
        require(success, "Transfer to seller failed.");

        emit AuctionEnded(winner, finalAmount);
    }

    function getAuctionDetails() external view returns (
        string memory, uint, uint, bool, address, uint
    ) {
        return (
            itemName,
            startPrice,
            auctionEndTime,
            ended,
            highestBidder,
            highestBid
        );
    }

    function getPendingReturns(address bidder) external view returns (uint) {
        return pendingReturns[bidder];
    }

    function getSeller() external view returns (address) {
        return seller;
    }
}
