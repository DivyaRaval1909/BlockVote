const { ethers } = require("ethers");
async function test() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  try {
      const accounts = await provider.listAccounts();
      console.log(`Hardhat Node has ${accounts.length} default accounts.`);
      for (let i = 0; i < Math.min(accounts.length, 5); i++) {
          const balance = await provider.getBalance(accounts[i]);
          console.log(`Account[${i}] ${accounts[i]}: ${ethers.utils.formatEther(balance)} ETH`);
      }
  } catch (e) {
      console.error("Failed to connect to Localhost:", e.message);
  }
}
test();
