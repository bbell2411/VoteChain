import { useLocation } from 'react-router-dom';
import { use, useState } from 'react';

export const Dashboard = () => {
    const location = useLocation()
    const walletAddress = location.state?.walletAddress
  
    const [votedIndex, setVotedIndex] = useState(null)
  
    const [proposals, setProposals] = useState([
      { title: 'Add dark mode', votes: 5 },
      { title: 'Launch DAO token', votes: 2 },
      { title: 'Reward contributors', votes: 8 },
    ]);
  
    const voteForProposal = (index) => {
      if (votedIndex !== null) return
  
      const updated = [...proposals]
      updated[index].votes += 1
      setProposals(updated)
      setVotedIndex(index)
    };
  
    return (
      <div className="dashboard">
        <h1>Welcome to VoteChain</h1>
        <p>Connected Wallet: {walletAddress}</p>
  
        {proposals.map((p, i) => (
          <div key={i} className="proposal">
            <h2>{p.title}</h2>
            <p>Votes: {p.votes}</p>
  
            {votedIndex === null ? (
              <button onClick={() => voteForProposal(i)}>Vote</button>
            ) : votedIndex === i ? (
              <p>✅ You voted for this</p>
            ) : (
              <p>❌ You cannot vote again</p>
            )}
          </div>
        ))}
      </div>
    )
  }
  
