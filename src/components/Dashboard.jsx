import { useLocation } from 'react-router-dom';
import { use, useEffect, useState } from 'react';
import { contractABI, contractAddress } from '../../contracts/config.js';

export const Dashboard = () => {
    const location = useLocation()
    const walletAddress = location.state?.walletAddress

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

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

    const fetchProposals = async () => {
        try {
            setIsLoading(true);
            const proposalTitles = await contract.getAllProposals();

            // For each proposal, also fetch votes
            const proposalsWithVotes = await Promise.all(
                proposalTitles.map(async (title) => {
                    const votes = await contract.getVotes(title);
                    return { title, votes: votes.toNumber() };
                })
            );

            setProposals(proposalsWithVotes);
            setIsLoading(false);
        } catch (err) {
              setError(true)
        }
        finally {
            setIsLoading(false)
        }
    }

    //vote for a proposal!!!! (continue)
    const voteForProposal = async (proposalTitle) => {
        if (votedProposals.includes(proposalTitle)) return;
    
        try {
          setIsLoading(true);
          const tx = await contract.vote(proposalTitle)
          await tx.wait()
    
          await fetchProposals();
          setVotedProposals([...votedProposals, proposalTitle]);
          setIsLoading(false);
        } catch (err) {
          setError('Failed to vote');
          setIsLoading(false);
        }
      }

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

