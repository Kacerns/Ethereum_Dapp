const Auction = artifacts.require("Auction");

module.exports = function (deployer) {
  const itemName = "Rare Painting";
  const startPrice = web3.utils.toWei("0.1", "ether");
  const durationMinutes = 3;
  deployer.deploy(Auction, itemName, startPrice, durationMinutes);
};
