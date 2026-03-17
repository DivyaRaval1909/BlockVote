import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { VotingContext } from "../context/Voter";
import ThemeToggle from "../components/ThemeToggle";

const VoterList = () => {
  const { currentAccount, connectWallet, disconnectWallet, getVoters, isOrganizer } = useContext(VotingContext);
  const [voters, setVoters] = useState([]);

  const fetchVotersData = async () => {
    const items = await getVoters();
    if (items) setVoters(items);
  };

  useEffect(() => {
    if (currentAccount) {
      fetchVotersData();
    }
  }, [currentAccount, getVoters]);

  return (
    <div className="container">
      <Head>
        <title>Voters - BlockVote</title>
      </Head>

      <div className="header">
        <div className="logo">BlockVote</div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          {isOrganizer && <Link href="/candidate-regisration">Add Candidate</Link>}
          {isOrganizer && <Link href="/allowed-voters">Allow Voter</Link>}
          <Link href="/voterList" style={{ color: "var(--text-light)" }}>Voter List</Link>

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

      <h1 className="title">Allowed Voters</h1>
      <p className="subtitle">List of Ethereum addresses verified to participate in the upcoming election.</p>

      {currentAccount ? (
        <div className="grid">
          {voters.length > 0 ? (
            voters.map((voter, i) => (
              <div className="card voter-card" key={i}>
                <img src={voter.image} alt={voter.name} className="voter-avatar" />
                <div>
                  <h3>{voter.name}</h3>
                  <p className="subtitle" style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
                    ID: {voter.voterId}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    {voter.address.slice(0, 8)}...{voter.address.slice(-6)}
                  </p>
                  {voter.voted ? (
                    <span className="status-badge status-voted">Voted</span>
                  ) : (
                    <span className="status-badge status-pending">Pending</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "3rem" }}>
              No voters registered yet.
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

export default VoterList;
