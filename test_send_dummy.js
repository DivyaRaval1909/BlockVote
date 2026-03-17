const { ethers } = require("ethers");
async function test() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const accounts = await provider.listAccounts();
  const signer = provider.getSigner(accounts[0]);
  
  try {
     const tx = await signer.sendTransaction({
        to: accounts[1],
        value: ethers.utils.parseEther("0.01")
     });
     await tx.wait();
     console.log("Successfully sent dummy TX. TX Hash:", tx.hash);
     
     const count = await provider.getTransactionCount(accounts[0]);
     console.log(`New Nonce is: ${count}`);
  } catch(e) {
     console.error("Dummy TX Failed:", e);
  }
}
test();
