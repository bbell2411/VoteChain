import { useState } from 'react';
import { ethers } from 'ethers';

export default function SendETH() {
  const [txHash, setTxHash] = useState('');

  const sendETH = async () => {
    if (!window.ethereum) return alert("MetaMask not found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    try {
      const tx = await signer.sendTransaction({
        to: "0x123...abc", // replace with a valid address
        value: ethers.parseEther("0.01")
      });

      await tx.wait();
      setTxHash(tx.hash);
      alert("ETH sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed.");
    }
  };

  return (
    <div>
      <button className='send-eth' onClick={sendETH}>Send 0.01 ETH</button>
      {txHash && <p>Tx Hash: {txHash}</p>}
    </div>
  );
}
