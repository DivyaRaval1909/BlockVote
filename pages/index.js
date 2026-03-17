import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { VotingContext } from "../context/Voter";
import ThemeToggle from "../components/ThemeToggle";

const Index = () => {
  const { currentAccount, connectWallet, disconnectWallet, getCandidates, castVote, isLoading, isOrganizer } = useContext(VotingContext);
  const [candidates, setCandidates] = useState([]);

  const fetchCandidatesData = async () => {
    const items = await getCandidates();
    if (items) setCandidates(items);
  };

  useEffect(() => {
    if (currentAccount) {
      fetchCandidatesData();
    }
  }, [currentAccount, getCandidates]);

  return (
    <div className="container">
      <Head>
        <title>Decentralized Voting System</title>
      </Head>

      <div className="header">
        <div className="logo">BlockVote</div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          {isOrganizer && <Link href="/candidate-regisration">Add Candidate</Link>}
          {isOrganizer && <Link href="/allowed-voters">Allow Voter</Link>}
          <Link href="/voterList">Voter List</Link>

          <ThemeToggle />

          {!currentAccount ? (
            <button className="btn" onClick={() => connectWallet()}>
              Connect Wallet
            </button>
          ) : (
            <button className="btn" onClick={() => disconnectWallet()}>
              Disconnect: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
            </button>
          )}
        </div>
      </div>

      <h1 className="title">Active Candidates</h1>
      <p className="subtitle">Secure, transparent, and immutable voting on the Ethereum blockchain.</p>

      {currentAccount ? (
        <div className="grid">
          {candidates.length > 0 ? (
            candidates.map((candidate, i) => (
              <div className="card candidate-info" key={i}>
                <img src={candidate.image} alt={candidate.name} className="candidate-image" />
                <h3>{candidate.name} (Age: {candidate.age})</h3>
                <div className="vote-count">{candidate.voteCount} Votes</div>
                <p>Address: {candidate.address.slice(0, 10)}...</p>
                <button
                  className="btn"
                  style={{ width: "100%", marginTop: "1rem", opacity: isLoading ? 0.7 : 1 }}
                  onClick={() => castVote(candidate.address, candidate.candidateId)}
                  disabled={isLoading}
                >
                  {isLoading ? "⏳ Casting Vote..." : "Cast Vote"}
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "3rem" }}>
              No candidates currently available.
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
          <h2>Wallet Disconnected</h2>
          <p className="subtitle" style={{ margin: "1rem 0" }}>Please connect your MetaMask wallet to interact with the blockchain.</p>
          <button className="btn" onClick={() => connectWallet()}>Connect MetaMask</button>
        </div>
      )}
    </div>
  );
};

export default Index;
