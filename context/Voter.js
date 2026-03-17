import React, { createContext, useState, useEffect, useContext } from "react";
import { ErrorContext } from "../components/ErrorToast";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { VotingAddress, VotingAddressABI } from "./constants";

export const VotingContext = createContext();

const fetchContract = (signerOrProvider) =>
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingProvider = ({ children }) => {
    const { triggerError } = useContext(ErrorContext);
    const [currentAccount, setCurrentAccount] = useState("");
    const [organizer, setOrganizer] = useState("");
    const [candidateLength, setCandidateLength] = useState(0);
    const [voterLength, setVoterLength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchOrganizer = async () => {
            try {
                const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
                const contract = fetchContract(provider);
                const org = await contract.votingOrganizer();
                setOrganizer(org.toLowerCase());
            } catch (error) {
                console.log("Error fetching organizer", error);
            }
        };
        fetchOrganizer();
    }, []);

    const isOrganizer = currentAccount && organizer && currentAccount.toLowerCase() === organizer;

    // --- CONNECT METAMASK ---
    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return console.log("Please install MetaMask");

        const accounts = await window.ethereum.request({ method: "eth_accounts" });

        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("No account found");
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) return console.log("Please install MetaMask");

        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x7A6A" }], // 31338
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x7A6A",
                                chainName: "Fresh Hardhat Local",
                                rpcUrls: ["http://localhost:8545/"],
                                nativeCurrency: {
                                    name: "ETH",
                                    symbol: "ETH",
                                    decimals: 18,
                                },
                            },
                        ],
                    });
                } catch (addError) {
                    console.error("Failed to add Hardhat network", addError);
                    return;
                }
            } else {
                console.error("Failed to switch to Hardhat network", switchError);
                return;
            }
        }

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        setCurrentAccount(accounts[0]);
    };

    const disconnectWallet = () => {
        setCurrentAccount("");
    };

    // --- GET ALL CANDIDATE DATA ---
    const getCandidates = async () => {
        try {
            if (!window.ethereum) return;

            const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
            const contract = fetchContract(provider);

            const candidates = await contract.getCandidate();

            const allCandidates = await Promise.all(
                candidates.map(async (address) => {
                    const c = await contract.getCandidateData(address);
                    return {
                        age: c[0],
                        name: c[1],
                        candidateId: c[2].toNumber(),
                        image: c[3],
                        voteCount: c[4].toNumber(),
                        ipfs: c[5],
                        address: c[6]
                    };
                })
            );

            const length = await contract.getCandidateLength();
            setCandidateLength(length.toNumber());

            return allCandidates;
        } catch (error) {
            console.log("Something went wrong fetching candidates", error);
        }
    };

    // --- SET CANDIDATE ---
    const setCandidate = async (candidateInfo, router) => {
        try {
            const { address, age, name, image, ipfs } = candidateInfo;

            if (!address || !age || !name || !image || !ipfs) return console.error("Data missing");

            setIsLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const tx = await contract.setCandidate(address, age, name, image, ipfs);
            await tx.wait();

            console.log("Candidate set successfully");
            setIsLoading(false);
            router.push("/");
        } catch (error) {
            console.error("Error creating candidate", error);
            triggerError(`Transaction failed! ${error.reason || error.message || JSON.stringify(error)}`);
            setIsLoading(false);
        }
    };

    // --- GET ALL VOTER DATA ---
    const getVoters = async () => {
        try {
            if (!window.ethereum) return;

            const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
            const contract = fetchContract(provider);

            const voters = await contract.getVoterList();

            const allVoters = await Promise.all(
                voters.map(async (address) => {
                    const v = await contract.getVoterData(address);
                    return {
                        voterId: v[0].toNumber(),
                        name: v[1],
                        image: v[2],
                        address: v[3],
                        ipfs: v[4],
                        allowed: v[5].toNumber(),
                        voted: v[6]
                    };
                })
            );

            const length = await contract.getVoterLength();
            setVoterLength(length.toNumber());

            return allVoters;
        } catch (error) {
            console.log("Something went wrong fetching voters", error);
        }
    };

    // --- GIVE VOTER RIGHT ---
    const voterRight = async (voterInfo, router) => {
        try {
            const { address, name, image, ipfs } = voterInfo;

            if (!address || !name || !image || !ipfs) return console.error("Data missing");

            setIsLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const tx = await contract.voterRight(address, name, image, ipfs);
            await tx.wait();

            console.log("Voter registered successfully");
            setIsLoading(false);
            router.push("/voterList");
        } catch (error) {
            console.error("Error registering voter", error);
            triggerError(`Transaction failed! ${error.reason || error.message || JSON.stringify(error)}`);
            setIsLoading(false);
        }
    };

    // --- CAST VOTE ---
    const castVote = async (candidateAddress, candidateVoteId) => {
        try {
            setIsLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const tx = await contract.vote(candidateAddress, candidateVoteId);
            await tx.wait();

            console.log("Voted successfully");
            setIsLoading(false);
        } catch (error) {
            console.error("Error casting vote", error);
            triggerError(`Voting failed: ${error.reason || error.message || "Unknown error"}`);
            setIsLoading(false);
        }
    };

    return (
        <VotingContext.Provider
            value={{
                currentAccount,
                connectWallet,
                disconnectWallet,
                checkIfWalletIsConnected,
                setCandidate,
                getCandidates,
                voterRight,
                getVoters,
                castVote,
                candidateLength,
                voterLength,
                isLoading,
                isOrganizer
            }}
        >
            {children}
        </VotingContext.Provider>
    );
};
