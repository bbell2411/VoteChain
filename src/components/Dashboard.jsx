import { useLocation } from 'react-router-dom';
import { use, useEffect, useState } from 'react';

export const Dashboard = () => {
    const location = useLocation()
    const walletAddress = location.state?.walletAddress

    const [votedProposals, setVotedProposals] = useState(() => {
        const saved = localStorage.getItem('votedProposals')
        return saved ? JSON.parse(saved) : []
    })

    const [proposals, setProposals] = useState(() => {
        const savedProposals = localStorage.getItem('proposals')
        return savedProposals
            ? JSON.parse(savedProposals)
            : [
                { title: 'Add dark mode', votes: 5 },
                { title: 'Launch DAO token', votes: 2 },
                { title: 'Reward contributors', votes: 8 },
            ]
    })

    useEffect(() => {
        localStorage.setItem('proposals', JSON.stringify(proposals))
    }, [proposals])

    useEffect(() => {
        localStorage.setItem('votedProposals', JSON.stringify(votedProposals))
    }, [votedProposals])

    const voteForProposal = (index) => {
        if (votedProposals.includes(index)) return

        const updated = [...proposals]
        updated[index].votes += 1
        setProposals(updated)
        setVotedProposals([...votedProposals, index])
    };

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

