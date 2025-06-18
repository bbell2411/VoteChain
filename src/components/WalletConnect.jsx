import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

export default function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState('')
  const navigate = useNavigate()

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not found")
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setWalletAddress(accounts[0])
    navigate('/dashboard', { state: { walletAddress: accounts[0] } })
  }

  return (
    <div>
      <h2 className="wallet-header">Connect to get started</h2>
      <button className="add-wallet" onClick={connectWallet}>
        {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
      </button>
    </div>
  );
}