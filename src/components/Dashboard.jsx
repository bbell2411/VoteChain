import { useLocation } from 'react-router-dom';
import { use, useEffect, useState } from 'react';
import { contractABI, contractAddress } from '../../contracts/config.js'; 

export const Dashboard = () => {
    const location = useLocation()
    const walletAddress = location.state?.walletAddress

  
    const [proposals, setProposals] = useState([]);
    const [votedProposals, setVotedProposals] = useState([])

    const [contract, setContract] = useState(null)

    useEffect(() => {
        if (window.ethereum && walletAddress) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = provider.getSigner();
    
          const voteContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(voteContract);
        }
      }, [walletAddress])

    // const voteForProposal = (index) => {
    //     if (votedProposals.includes(index)) return

    //     const updated = [...proposals]
    //     updated[index].votes += 1
    //     setProposals(updated)
    //     setVotedProposals([...votedProposals, index])
    // };

    return (
        <div className="dashboard">
            <h1>Welcome to VoteChain</h1>
            <p className='connected'>Connected Wallet: {walletAddress}</p>

            {proposals.map((p, i) => (
                <div key={i} className="proposal">
                    <h2>{p.title}</h2>
                    <p>Votes: {p.votes}</p>

                    {votedProposals.includes(i) ? (
                        <p>✅ You voted for this</p>
                    ) : (
                        <button onClick={() => voteForProposal(i)}>Vote</button>
                    )}
                </div>
            ))}
        </div>
    )
}

