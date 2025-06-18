import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export default function ProposalList() {
  const [proposals, setProposals] = useState([
    { title: 'Add dark mode', votes: 5 },
    { title: 'Launch DAO token', votes: 2 },
    { title: 'Reward top contributors', votes: 8 },
  ])
  const contractAddress = ""

  const abi = [
    "function getAllProposals() public view returns (string[] memory)"
  ]

//   useEffect(() => {
//     const fetchProposals = async () => {
//       if (!window.ethereum) return alert("MetaMask not found")

//       const provider = new ethers.BrowserProvider(window.ethereum)
//       const signer = await provider.getSigner()
//       const contract = new ethers.Contract(contractAddress, abi, signer)

//       try {
//         const result = await contract.getAllProposals()
//         setProposals(result);
//       } catch (error) {
//         console.error("Error fetching proposals:", error)
//       }
//     }

//     fetchProposals();
//   }, [])

  return (
    <div>
      <h2>Proposals</h2>
      <ul>
        {proposals.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
