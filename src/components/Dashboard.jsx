import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../Contracts/config';
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
        const setupContractAndFetch = async () => {
            if (window.ethereum && walletAddress) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum)
                    const signer = await provider.getSigner()
                    const voteContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
                    setContract(voteContract)

                    const proposalTitles = await voteContract.getAllProposals()
                    const proposalsWithVotes = await Promise.all(
                        proposalTitles.map(async (title) => {
                            const votes = await voteContract.getVotes(title)
                            return { title, votes: Number(votes) }
                        })
                    )
                    setProposals(proposalsWithVotes)
                } catch (err) {
                    console.error("Contract setup or fetch failed:", err)
                    setError(true)
                }
            }
        }

        setupContractAndFetch()
    }, [walletAddress])

    const fetchProposals = async () => {
        if (!contract) return
        try {
            setIsLoading(true)
            const proposalTitles = await contract.getAllProposals()

            const proposalsWithVotes = await Promise.all(
                proposalTitles.map(async (title) => {
                    const votes = await contract.getVotes(title)
                    return { title, votes: Number(votes) }
                })
            )

            setProposals(proposalsWithVotes)
        } catch (err) {
            console.log("here", contract)
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
        } catch (err) {
            setError(true)
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }
    const handleAddProposal = async (e) => {
        e.preventDefault();
        if (!newProposal.trim()) return;

        try {
            setIsLoading(true)
            const tx = await contract.addProposal(newProposal)
            await tx.wait()
            await fetchProposals()
            alert("Proposal added!")
            setNewProposal('')
        } catch (err) {
            console.error(err)
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <Loading />

    if (error) return <p style={{ color: 'red' }}>Error loading proposals. Please try again later.</p>

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

//load && err!!!


