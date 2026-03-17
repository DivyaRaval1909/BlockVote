import React, { useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { VotingContext } from "../context/Voter";
import ThemeToggle from "../components/ThemeToggle";

const AllowedVoters = () => {
  const { voterRight, currentAccount, connectWallet, disconnectWallet, isLoading, isOrganizer } = useContext(VotingContext);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    image: "",
    ipfs: "https://ipfs.io/ipfs/Qm..." // mock
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    voterRight(form, router);
  };

  return (
    <div className="container">
      <Head>
        <title>Allow Voter - BlockVote</title>
      </Head>

      <div className="header">
        <div className="logo">BlockVote</div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          {isOrganizer && <Link href="/candidate-regisration">Add Candidate</Link>}
          {isOrganizer && <Link href="/allowed-voters" style={{ color: "var(--text-light)" }}>Allow Voter</Link>}
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

      <div className="form-container card">
        <h1 className="title">Grant Voting Rights</h1>
        <p className="subtitle" style={{ marginBottom: "2rem" }}>Authorize an Ethereum Address to cast a ballot in the ongoing election.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Voter Identity (Name / Alias)</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Wallet Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = async () => {
                  try {
                    const response = await fetch('/api/upload', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ imageBase64: reader.result, fileName: file.name.split('.')[0] })
                    });
                    const data = await response.json();
                    if (data.url) setForm({ ...form, image: data.url });
                  } catch (err) {
                    console.error("Upload failed", err);
                  }
                };
                reader.readAsDataURL(file);
              }}
              required
            />
            {form.image && <p style={{ fontSize: "0.8rem", color: "var(--primary)", marginTop: "0.5rem" }}>Image uploaded successfully!</p>}
          </div>

          <button
            type="submit"
            className="btn"
            style={{ width: "100%", marginTop: "1rem", opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            {isLoading ? "⏳ Confirming Transaction in Wallet..." : "Authorize on Blockchain"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AllowedVoters;
