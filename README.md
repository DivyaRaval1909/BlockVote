# BlockVote - Decentralized Voting Application

BlockVote is a secure, transparent, and immutable decentralized voting application built on the Ethereum blockchain. It allows designated organizers to seamlessly create elections, register authorized voters, and track votes in real-time through a premium, fully responsive Web3 interface.

## Core Features

- **Smart Contract Driven:** All core logic, from candidate registration to vote tallying, is securely executed on-chain via Solidity smart contracts.
- **Organizer Authorization:** Strict access controls ensure that only the contract deployer (the organizer) can register candidates and authorize specific Ethereum addresses to participate in the election.
- **Glassmorphism Interface:** A highly polished, cyberpunk-inspired UI featuring dynamic light/dark modes, custom glowing cursors, smooth element transitions, and an animated particle background.
- **Real-Time Data Sync:** Candidate information, voter statuses, and live vote counts are automatically synchronized seamlessly with the Ethereum network using ethers.js.
- **Global Error Handling:** Native browser alerts are fully replaced by an elegant, custom-built React Error Context system that surfaces transient toast notifications.

## Technology Stack

- **Frontend:** React, Next.js, CSS variables (Custom UI)
- **Web3 Integration:** ethers.js, Web3Modal
- **Smart Contracts:** Solidity
- **Local Development Environment:** Hardhat
- **Wallet Connection:** MetaMask

## Project Structure

- `contracts/` - Contains the foundational `VotingContract.sol` file managing election states and access controls.
- `context/` - Houses the `Voter.js` Web3 React context provider which manages smart contract interactions and global application state.
- `pages/` - Includes the Next.js routing files tailored for specific dashboard functionalities (`index.js`, `allowed-voters.js`, `candidate-registration.js`, `voterList.js`).
- `components/` - Standalone reusable UI components, such as `ErrorToast.jsx`, `ThemeToggle.jsx`, and `NavBar.jsx`.
- `styles/` - Global styling configurations, keyframe animations, and theming tokens inside `globals.css`.

## Setup and Installation

### Prerequisites

Ensure you have the following installed to run the local blockchain and the frontend layer:
- Node.js
- MetaMask (Browser extension)

### 1. Initialize the Environment

Clone the repository and install the required dependencies:

```bash
npm install
```

### 2. Launch Local Blockchain

Open a terminal window and start the Hardhat local node. This will generate 20 persistent local accounts containing test ETH.

```bash
npx hardhat node
```

### 3. Deploy the Smart Contract

Open a secondary terminal window and deploy the compiled smart contract to your active local node. 

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the generated contract address output from the terminal and navigate to `context/constants.js`. Replace the `VotingAddress` variable with your newly generated contract string.

### 4. Start the Application

In your secondary terminal window, initialize the Next.js development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser. When MetaMask prompts you to connect, switch to your Hardhat Localhost network (Chain ID: 31338) and import one of the private keys generated from step 2 to act as the Organizer.

## Usage Guide

1. **Dashboard Access:** The organizer (the wallet address used to deploy the contract) will see exclusive links to "Add Candidate" and "Allow Voter" in the navigation bar.
2. **Authorize Voters:** The organizer must manually register the Ethereum addresses of participants who are allowed to vote on the "Allow Voter" page.
3. **Register Candidates:** The organizer can add specific candidates to the election on the "Add Candidate" page.
4. **Casting a Vote:** Authorized voters can connect their standard MetaMask wallets to the application. Once connected, they may browse the active candidates on the Home page and cast their single, immutable vote.
5. **Vote Tally:** Vote tallies are completely public and dynamically tracked across the candidate cards.

## Security Considerations

This application is currently configured for local deployment (`localhost`) via Hardhat for educational and prototyping purposes. Before deploying `VotingContract.sol` to a public Ethereum testnet (e.g., Sepolia) or the Mainnet, ensure all private keys, endpoints, and strict security audits are formally completed.
