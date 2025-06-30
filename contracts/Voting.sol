// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    struct Proposal {
        string title;
        uint256 voteCount;
        uint256 deadline; // timestamp when voting ends
    }

    mapping(string => Proposal) public proposals;
    mapping(address => mapping(string => bool)) public hasVoted;

    string[] public proposalList;

    function addProposal(string memory title, uint256 durationInMinutes) public {
        require(proposals[title].deadline == 0, "Proposal already exists");

        proposals[title] = Proposal({
            title: title,
            voteCount: 0,
            deadline: block.timestamp + (durationInMinutes * 1 minutes)
        });

        proposalList.push(title);
    }

    function vote(string memory title) public {
        require(block.timestamp < proposals[title].deadline, "Voting period expired");
        require(!hasVoted[msg.sender][title], "Already voted for this proposal");

        proposals[title].voteCount++;
        hasVoted[msg.sender][title] = true;
    }

    function getVotes(string memory title) public view returns (uint256) {
        return proposals[title].voteCount;
    }

    function getAllProposals() public view returns (string[] memory) {
        return proposalList;
    }

    function getDeadline(string memory title) public view returns (uint256) {
        return proposals[title].deadline;
    }
}


