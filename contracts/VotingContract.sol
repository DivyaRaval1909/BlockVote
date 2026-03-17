// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract VotingContract {
    uint256 public _voterId;
    uint256 public _candidateId;
    address public votingOrganizer;

    struct Candidate {
        uint256 candidateId;
        string age;
        string name;
        string image;
        uint256 voteCount;
        address _address;
        string ipfs;
    }

    struct Voter {
        uint256 voter_voterId;
        string voter_name;
        string voter_image;
        address voter_address;
        uint256 voter_allowed;
        bool voter_voted;
        uint256 voter_vote;
        string voter_ipfs;
    }

    address[] public candidateAddress;
    mapping(address => Candidate) public candidates;

    address[] public votersAddress;
    address[] public votedVoters;
    mapping(address => Voter) public voters;

    constructor() {
        votingOrganizer = msg.sender;
    }

    function setCandidate(
        address _address,
        string memory _age,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(msg.sender == votingOrganizer, "Only organizer can create candidates");
        require(candidates[_address]._address != _address, "Candidate already exists");

        _candidateId++;
        Candidate storage candidate = candidates[_address];
        candidate.candidateId = _candidateId;
        candidate.age = _age;
        candidate.name = _name;
        candidate.image = _image;
        candidate.voteCount = 0;
        candidate._address = _address;
        candidate.ipfs = _ipfs;
        
        candidateAddress.push(_address);
    }

    function voterRight(
        address _address,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(msg.sender == votingOrganizer, "Only organizer can register voters");
        require(voters[_address].voter_address != _address, "Voter already registered");

        _voterId++;
        Voter storage voter = voters[_address];
        voter.voter_voterId = _voterId;
        voter.voter_name = _name;
        voter.voter_image = _image;
        voter.voter_address = _address;
        voter.voter_allowed = 1;
        voter.voter_voted = false;
        voter.voter_vote = 1000;
        voter.voter_ipfs = _ipfs;
        
        votersAddress.push(_address);
    }

    function vote(address _candidateAddress, uint256 _candidateVoteId) public {
        Voter storage voter = voters[msg.sender];
        require(!voter.voter_voted, "You have already voted");
        require(voter.voter_allowed != 0, "You have no right to vote");
        
        voter.voter_voted = true;
        voter.voter_vote = _candidateVoteId;
        
        candidates[_candidateAddress].voteCount += 1;
        votedVoters.push(msg.sender);
    }

    // ----- GETTERS -----

    function getCandidate() public view returns (address[] memory) {
        return candidateAddress;
    }

    function getCandidateLength() public view returns (uint256) {
        return candidateAddress.length;
    }

    function getCandidateData(address _address) public view returns (
        string memory,
        string memory,
        uint256,
        string memory,
        uint256,
        string memory,
        address
    ) {
        Candidate memory c = candidates[_address];
        return (
            c.age,
            c.name,
            c.candidateId,
            c.image,
            c.voteCount,
            c.ipfs,
            c._address
        );
    }

    function getVoterList() public view returns (address[] memory) {
        return votersAddress;
    }

    function getVoterLength() public view returns (uint256) {
        return votersAddress.length;
    }

    function getVoterData(address _address) public view returns (
        uint256,
        string memory,
        string memory,
        address,
        string memory,
        uint256,
        bool
    ) {
        Voter memory v = voters[_address];
        return (
            v.voter_voterId,
            v.voter_name,
            v.voter_image,
            v.voter_address,
            v.voter_ipfs,
            v.voter_allowed,
            v.voter_voted
        );
    }

    function getVotedVotersList() public view returns (address[] memory) {
        return votedVoters;
    }
}
