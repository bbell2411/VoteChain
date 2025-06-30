// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    mapping(string => uint256) public votes;
    string[] public proposalList;

    mapping(address => mapping(string => bool)) public hasVoted;

    function addProposal(string memory proposal) public {
        proposalList.push(proposal);
    }

    function vote(string memory proposal) public {
        require(!hasVoted[msg.sender][proposal], "Already voted for this proposal");

        votes[proposal]++;
        hasVoted[msg.sender][proposal] = true;
    }

    function getVotes(string memory proposal) public view returns (uint256) {
        return votes[proposal];
    }

    function getAllProposals() public view returns (string[] memory) {
        return proposalList;
    }
}

