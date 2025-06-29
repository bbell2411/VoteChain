import { useLocation } from 'react-router-dom';
import { use, useEffect, useState } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../contracts/config';
import { ethers } from 'ethers'
import Loading from './Loading'
export const Dashboard = () => {
    const location = useLocation()
    const walletAddress = location.state?.walletAddress

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    const [proposals, setProposals] = useState([]);
    const [votedProposals, setVotedProposals] = useState([])

    const [contract, setContract] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [newProposal, setNewProposal] = useState('')

    useEffect(() => {
        if (window.ethereum && walletAddress) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = provider.getSigner()

            const voteContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
            setContract(voteContract)
        }
    }, [walletAddress])

    const fetchProposals = async () => {
        try {
            setIsLoading(true)
            const proposalTitles = await contract.getAllProposals()

            const proposalsWithVotes = await Promise.all(
                proposalTitles.map(async (title) => {
                    const votes = await contract.getVotes(title)
                    return { title, votes: votes.toNumber() }
                })
            )

            setProposals(proposalsWithVotes)
            setIsLoading(false)
        } catch (err) {
            setError(true)
        }
        finally {
            setIsLoading(false)
        }
    }

    const voteForProposal = async (proposalTitle) => {
        if (votedProposals.includes(proposalTitle)) return;

        try {
            setIsLoading(true);
            const tx = await contract.vote(proposalTitle)
            await tx.wait()

            await fetchProposals()
            setVotedProposals([...votedProposals, proposalTitle])
            setIsLoading(false)
        } catch (err) {
            setError('Failed to vote')
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddProposal = async (e) => {
        e.preventDefault()
        if (!newProposal.trim()) return

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

        try {
            const tx = await contract.addProposal(newProposal)
            await tx.wait()
            alert('Proposal added!')
            await fetchProposals()
            setIsLoading(false)
        } catch (err) {
            setError(true)
        }
    }
    if (isLoading) <Loading />

    if (error) <p style={{ color: 'red' }}>Error loading proposals. Please try again later.</p>
    
    return (
        <div className="dashboard">
            <h1>Start voting</h1>
            <p className='connected'>Connected Wallet: {walletAddress}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading && <p>Loading...</p>}
            {proposals.length === 0 && !isLoading && <p>No proposals available.</p>}
            {proposals.map((p, i) => (
                <div key={i} className="proposal">
                    <h2>{p.title}</h2>
                    <p>Votes: {p.votes}</p>

                    {votedProposals.includes(p.title) ? (
                        <p>✅ You voted for this</p>
                    ) : (
                        <button onClick={() => voteForProposal(p.title)}>Vote</button>
                    )}

                </div>
            ))}
            <button className="toggle-form-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "➕ Add Proposal"}
            </button>

            {showForm && (
                <form className="proposal-form" onSubmit={handleAddProposal}>
                    <input
                        type="text"
                        value={newProposal}
                        onChange={(e) => setNewProposal(e.target.value)}
                        placeholder="Enter proposal title..."
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

        </div>
    )
}

//Add wallet disconnection logic
// Add transaction history
// Show proposal expiration timers (optional: update your contract)
// proposal persistance after transaction?!

