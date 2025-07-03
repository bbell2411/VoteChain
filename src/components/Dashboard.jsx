import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../Contracts/config';
import { ethers } from 'ethers'
import Loading from './Loading'
import { useNavigate } from 'react-router-dom'
export const Dashboard = () => {
    const navigate = useNavigate()

    const location = useLocation()
    const walletAddress = location.state?.walletAddress

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    const [proposals, setProposals] = useState([]);
    const [votedProposals, setVotedProposals] = useState(() => {
        const saved = localStorage.getItem('votedProposals')
        return saved ? JSON.parse(saved) : []
    })

    const [contract, setContract] = useState(null)

    const [showForm, setShowForm] = useState(false)
    const [newProposal, setNewProposal] = useState('')

    const [duration, setDuration] = useState(10)

    useEffect(() => {
        localStorage.setItem('votedProposals', JSON.stringify(votedProposals));
    }, [votedProposals])

    useEffect(() => {
        const setupContract = async () => {
            if (window.ethereum && walletAddress) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum)
                    const signer = await provider.getSigner()
                    const voteContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
                    setContract(voteContract)
                } catch (err) {
                    setError(true)
                }
            }
        }

        setupContract()
    }, [walletAddress])

    useEffect(() => {
        if (contract) {
            fetchProposals();
        }
    }, [contract])

    const fetchProposals = async () => {
        if (!contract) return
        try {
            setIsLoading(true)
            const proposalTitles = await contract.getAllProposals()
            const now = Date.now()
            const proposalsWithDetails = await Promise.all(
                proposalTitles.map(async (title) => {
                    const { voteCount, deadline } = await contract.proposals(title)

                    console.log(voteCount, deadline, "voteCount and deadline")

                    const votes = Number(voteCount) ?? 0
                    const deadlineMs = deadline ? Number(deadline) * 1000 : 0
                    return {
                        title,
                        votes,
                        deadline: deadlineMs ? new Date(deadlineMs) : null,
                        expired: deadlineMs ? deadlineMs < now : false,
                    }
                })
            )

            setProposals(proposalsWithDetails)
        } catch (err) {
            console.error("Failed to fetch proposals:", err)
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }
    console.log(proposals, "the proposals")

    const voteForProposal = async (proposalTitle, deadline) => {
        const now = Date.now()

        if (deadline * 1000 < now) {
            alert("Voting for this proposal has expired.");
            return
        }

        if (votedProposals.includes(proposalTitle)) {
            alert("You already voted for this proposal.");
            return
        }

        try {
            setIsLoading(true);
            const tx = await contract.vote(proposalTitle)
            await tx.wait()

            await fetchProposals()
            setVotedProposals([...votedProposals, proposalTitle])
        } catch (err) {
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }
    const handleAddProposal = async (e) => {
        e.preventDefault();
        if (!newProposal.trim() || !duration) return;

        try {
            setIsLoading(true);
            const tx = await contract.addProposal(newProposal, Number(duration))
            await tx.wait()
            await fetchProposals()
            alert("Proposal added!")
            setNewProposal('')
            setDuration(10)
        } catch (err) {
            console.error("Contract setup or fetch failed:", err)
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const disconnectWallet = () => {
        setContract(null)
        setVotedProposals([])
        setProposals([])
        // localStorage.removeItem('votedProposals')
        navigate('/')
    }


    if (isLoading) return <Loading />

    if (error) return <p style={{ color: 'red' }}>Error loading proposals. Please try again later.</p>

    return (
        <div className="dashboard">
            <h1>Start voting</h1>
            <p className='connected'>Connected Wallet: {walletAddress}</p>
            <button className="disconnect-btn" onClick={disconnectWallet}>Disconnect</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading && <p>Loading...</p>}
            {proposals.length === 0 && !isLoading && <p>No proposals available.</p>}
            {proposals.map((p, i) => (
                <div key={i} className="proposal">
                    <h2>{p.title}</h2>
                    <p>Votes: {p.votes}</p>

                    <p>
                        Expires: {p.deadline && p.deadline > 0
                            ? new Date(p.deadline).toLocaleString()
                            : "No deadline set"}
                    </p>

                    {p.expired ? (
                        <p>⏰ Voting expired</p>
                    ) : votedProposals.includes(p.title) ? (
                        <p>✅ You voted</p>
                    ) : (
                        <button disabled={p.expired} onClick={() => voteForProposal(p.title, p.deadline)}>Vote</button>
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
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Duration (minutes)"
                        min="1"
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

        </div>
    )
}

// Add transaction history
// local storage (make sure votes persist)
//persisting votes and deadlines due to function only being invoked when updating blockchain (make sure they always show up in proposal state)
//delete proposals
//blockchain saves proposals and shows other users

