var Auction = artifacts.require("./Auction.sol");

module.exports = function (deployer) {
  const itemName = "Antique Vase";
  const startPrice = web3.utils.toWei("0.1", "ether"); // Start price: 0.1 ETH
  const durationMinutes = 60; // Auction duration: 60 minutes
  deployer.deploy(Auction, itemName, startPrice, durationMinutes);
};