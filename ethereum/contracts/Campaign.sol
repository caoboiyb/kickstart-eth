pragma solidity ^0.4.21;

contract CampaignFactory {
    address[] public campaigns;
    mapping(address => bool) verifyCampaigns;
    function createCampaign(uint _fundCall,string _name, uint _timeLock, uint _minimumContribution) public returns(address){
        address campaign = address(new Campaign(msg.sender, _name,_fundCall, _timeLock, _minimumContribution));
        campaigns.push(campaign);
        return campaign;
    }
    
    function getAllCampaigns() view public returns (address[]) {
        return campaigns;
    }

    function checkCampaign(address _campaignAddress) view public returns (bool) {
        return verifyCampaigns[_campaignAddress];
    }
    
    function() payable public {}
    
}


contract Campaign {
    
    uint public fundCall;
    uint public timeLock;
    uint public approversCount;
    uint public minimumContribution;
    string public name;
    address public owner;
    address[] public contributors;
    mapping(address => uint) public contributions;
    mapping(address => bool) public approvers;
    event NewCampaign(address owner,string name, uint fundCall, uint timeLock);
    bool public successful = false;
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool done;
        bool successful;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;
    
    
    constructor(address _owner,string _name, uint _fundCall, uint _timeLock, uint _minimumContribution) public {
        require(_fundCall != 0 && _timeLock != 0 && _minimumContribution != 0);
        name = _name;
        owner = _owner;
        fundCall = _fundCall * 1 wei;
        timeLock = now + _timeLock * 1 seconds;
        minimumContribution = _minimumContribution;
        emit NewCampaign(_owner, _name, _fundCall, _timeLock);
    }

    /*
        Contribute to campaign
        Contribution must be greater than 0
        Current time must before expired time
        Address becomes contributor of campaign 
        If total contribution greater than minimumContribution, address become approver for request receive fund when campaign is successful
     */
    function contribute() public payable {
        require(msg.value > 0);
        require(now < timeLock, "Time up");
        if(!isContributor(msg.sender)) {
            contributors.push(msg.sender);
        }
        if((contributions[msg.sender] + msg.value) >= minimumContribution) {
            approvers[msg.sender] = true;    
            if(!isContributor(msg.sender)) approversCount++;
        }
        contributions[msg.sender] += msg.value;
        if(address(this).balance >= fundCall && !successful){
            successful = true;
        } 
    }
    /*
        Check address has donated and address is not locked address(0x0)
     */
    function isContributor(address who) internal view returns(bool) {
        if (who != 0x0 && contributions[who] > 0) {
            return true;
        }
        return false;
    }
    

    /*
        Get list address of contributors
    */
    function getAllContributors() public view returns(address[]) {
        return contributors;
    }

    /*
        Get current balance of campaign  
     */    
    function currentBalance() public view returns(uint) {
        return address(this).balance;
    }
    

    /*
        Refund contribution for contributor when campaign is unsuccessful
        Current time must be less than expiry time
        Current balance must be less than fundCall
        Address is must be contributor and has not withdrawn 
     */
    function refund() public {
        require(now >= timeLock && address(this).balance < fundCall, "Campaign is running");
        require(isContributor(msg.sender), "You have not contributed yet");
        msg.sender.transfer(contributions[msg.sender]);
        contributions[msg.sender] = 0;
    }
    

    /*
        Create request to withdraw money
        Only owner of campaign can create request to withraw money
     */
    function createRequest(string _description, uint _value, address _recipient) public _onlyOnwner _exceedBalance(_value) _enoughFund _finalRequestDone {
        Request memory newRequest = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            done: false,
            successful: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }
    
    /*
        Donator approve request to withraw of campaign's owner
        Donator has one occasion to vote 
     */
    function approveRequest() public _existRequest _finalRequestUndone{
        Request storage request = requests[requests.length - 1];
        require(approvers[msg.sender], "Caller must be a approver");
        require(!request.approvals[msg.sender], "Approver has already voted");
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    /*
        Owner can cancel request
        Request must be uncomplete 
    */
    function cancelRequest() public _onlyOnwner _existRequest _finalRequestUndone{
        Request storage request = requests[requests.length - 1];
        request.done = true;
    }

    /*
        Owner withdraw when request is successful
        Request must be uncomplete
        Request must be successful voting
     */
    function withdrawRequest() public _onlyOnwner _existRequest _finalRequestUndone{
        Request storage request = requests[requests.length - 1];
        
        require(request.approvalCount > (approversCount / 2), "Not enough votes");
        request.recipient.transfer(request.value);
        request.done = true;
        request.successful = true;
    }
    
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
    
    function getSummary() public view returns (uint, uint, uint, uint, address, uint, int, string) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            owner,
            fundCall,
            int(timeLock * 1 seconds - now),
            name
        );
    }
    
    modifier _exceedBalance(uint _value){
        require(_value <= address(this).balance, "Out of balance");
        _;
    }
    
    modifier _onlyOnwner(){
        require(msg.sender == owner, "Only owner can do");
        _;
    }
    
    modifier _campaignExpired() {
        require(now >= timeLock, "Time expired");
        _;
    }
    
    modifier _enoughFund() {
        require(successful, "Must enough fundCall");
        _;
    }
    
    modifier _finalRequestDone() {
        if (requests.length > 0) {
            uint finalRequest = requests.length - 1;
            require(requests[finalRequest].done, "Final request must be complete before create new request");
        }
        _;
    }
    
    modifier _existRequest() {
        require(requests.length > 0, "Must existed request");
        _;
    }
    
    modifier _finalRequestUndone() {
        require(!requests[requests.length - 1].done, "Final request must uncomplete");
        _;
    }
}

