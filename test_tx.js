const { ethers } = require("ethers");
async function test() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const block = await provider.getBlockNumber();
  console.log("Current block:", block);
}
test();
