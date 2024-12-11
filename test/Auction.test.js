const Auction = artifacts.require("Auction");

// Helper function to increase blockchain time
const increaseTime = async (duration) => {
    await web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [duration], // time in seconds
        id: new Date().getTime(),
      },
      () => {}
    );
    await web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        id: new Date().getTime(),
      },
      () => {}
    );
  };
  

contract("Auction", (accounts) => {
  const seller = accounts[0];
  const buyer1 = accounts[1];
  const buyer2 = accounts[2];
  let auctionInstance;

  beforeEach(async () => {
    auctionInstance = await Auction.new("Test Item", web3.utils.toWei("1", "ether"), 5, { from: seller });
  });

  it("should set the seller and item correctly", async () => {
    const itemName = await auctionInstance.itemName();
    const auctionSeller = await auctionInstance.seller();

    assert.equal(itemName, "Test Item", "The item name is incorrect");
    assert.equal(auctionSeller, seller, "The seller address is incorrect");
  });

  it("should allow placing a bid", async () => {
    await auctionInstance.bid({ from: buyer1, value: web3.utils.toWei("2", "ether") });

    const highestBid = await auctionInstance.highestBid();
    const highestBidder = await auctionInstance.highestBidder();

    assert.equal(highestBid.toString(), web3.utils.toWei("2", "ether"), "Highest bid is incorrect");
    assert.equal(highestBidder, buyer1, "Highest bidder is incorrect");
  });

  it("should update the highest bid when a higher bid is placed", async () => {
    await auctionInstance.bid({ from: buyer1, value: web3.utils.toWei("2", "ether") });
    await auctionInstance.bid({ from: buyer2, value: web3.utils.toWei("3", "ether") });

    const highestBid = await auctionInstance.highestBid();
    const highestBidder = await auctionInstance.highestBidder();

    assert.equal(highestBid.toString(), web3.utils.toWei("3", "ether"), "Highest bid not updated correctly");
    assert.equal(highestBidder, buyer2, "Highest bidder not updated correctly");
  });

  it("should not accept a lower or equal bid", async () => {
    await auctionInstance.bid({ from: buyer1, value: web3.utils.toWei("2", "ether") });

    try {
      await auctionInstance.bid({ from: buyer2, value: web3.utils.toWei("1", "ether") });
      assert.fail("Bid with lower value should have failed");
    } catch (error) {
      assert(error.message.includes("There already is a higher or equal bid."), "Incorrect error message");
    }
  });

  it("should end the auction and transfer funds", async () => {
    await auctionInstance.bid({ from: buyer1, value: web3.utils.toWei("2", "ether") });

    await increaseTime(360);
    await auctionInstance.endAuction({ from: seller });
    const ended = await auctionInstance.ended();
    assert.equal(ended, true, "Auction should be marked as ended");
  });
});
