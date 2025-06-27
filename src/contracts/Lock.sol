// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    mapping(string => uint256) public votes;
    string[] public proposalList;

    function addProposal(string memory proposal) public {
        proposalList.push(proposal);
    }

    function vote(string memory proposal) public {
        votes[proposal]++;
    }

    function getVotes(string memory proposal) public view returns (uint256) {
        return votes[proposal];
    }

    function getAllProposals() public view returns (string[] memory) {
        return proposalList;
    }
}
