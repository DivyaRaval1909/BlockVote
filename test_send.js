const { ethers } = require("ethers");
async function test() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const accounts = await provider.listAccounts();
  if (accounts.length > 0) {
      const count = await provider.getTransactionCount(accounts[0]);
      console.log(`Account ${accounts[0]} nonce in Hardhat is: ${count}`);
  }
}
test();
