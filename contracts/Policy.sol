// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract Policy{
    
    function balanceOf() external view returns(uint) {
        return address(this).balance;
    }
    
    address private oracleId;
    bytes32 private jobId;
    uint256 private fee;
    bool public resultReceived;
    uint256 public result;

    struct cropType {
        string name;
        uint premiumPerAcre;    //in wei
        uint duration;          //in months
        uint coveragePerAcre;   //in wei
    }

    cropType[2] public cropTypes; //crops defined in constructor
    
    enum policyState {Pending, Active, PaidOut, TimedOut}
    struct policy {
        uint policyId;
        address user;
        uint premium;
        uint area;
        uint startTime;
        uint endTime;        
        string location;
        uint coverageAmount; 
        bool forFlood;
        uint8 cropId;
        policyState state;
    }

    // mapping(uint => policy) public policies;
    policy[] public policies;
    uint numPolicies = 0;
    
    // All policy ids for a particular user
    mapping(address => uint[]) public userPolicies; 
    
    //Fallback function to implement the ability for the Contract Address to Accept Ether
    fallback() external payable {}
    receive() external payable {}
    
    function newCrop(uint8 cropId, string memory name, uint premiumPerAcre, uint duration, uint coveragePerAcre) internal {
        cropType memory c = cropType(name, premiumPerAcre, duration, coveragePerAcre);
        cropTypes[cropId] = c;
    }
    
    constructor() public {
        newCrop(0, "rabi", 1, 6, 7);
        newCrop(1, "kharif", 2, 4, 10);
    }
    
    // Creating policy
    function newPolicy (uint area, string calldata location, bool forFlood, uint8 cropId) external payable{
        require(msg.value == (cropTypes[cropId].premiumPerAcre * area), "Incorrect Premium Amount");
        
        (bool sent,) = address(this).call{value : msg.value}("");
        require(sent, "Transaction Failed");
        
        uint pId = numPolicies;
        userPolicies[msg.sender].push(pId);
        policy memory p;

        p.policyId = numPolicies++;
        p.user = msg.sender;
        p.premium = cropTypes[cropId].premiumPerAcre * area;
        p.area = area;
        p.startTime = block.timestamp;
        p.endTime = block.timestamp + cropTypes[cropId].duration * 30*24*60*60;  // time in seconds
        p.location = location;
        p.coverageAmount = cropTypes[cropId].coveragePerAcre * area;
        p.forFlood = forFlood;
        p.cropId = cropId;
        p.state = policyState.Pending;
        
        policies.push(p);
    }
    
    // Covering policy
    function coverPolicy (uint policyId) external payable {
        
        policy storage p = policies[policyId];
        require(policies[policyId].user != msg.sender, "You can't cover your own policy.");
        require(policies[policyId].state == policyState.Pending, "Policy Already Covered");
        require(msg.value == p.coverageAmount, "Please cover with the exact required amount");
        
        (bool sent,) = address(this).call{value : msg.value}("");
        require(sent, "Transaction Failed");
    
        p.state = policyState.Active;   
    }
     
    // View all policies
    function viewAllPolicies() public view returns(policy[] memory) {
        return policies;
    }
    
    // View my policies
    function viewMyPolicies(address user) public view returns(policy[] memory) {
        
        uint len = userPolicies[user].length;
        policy[] memory res = new policy[](len);
        
        for(uint i = 0; i < len; i++) {
            res[i] = policies[userPolicies[user][i]];
        }
        
        return res;
    }
    
    //Claiming policy
    function claimPolicy(uint policyId) public {
        require(policyId < policies.length, "Policy doesn't exist");
        require(msg.sender == policies[policyId].user, "User Not Authorized");
        
        require(policies[policyId].state == policyState.Active, "Policy Not Activated");

        if(block.timestamp > policies[policyId].endTime)
        {
            policies[policyId].state = policyState.TimedOut;
            revert("Policy's Period has Ended.");
        }
    
        // string memory location = policies[policyId].location;

        // DateTime dt = DateTime(addressGetTime);
        // uint16 year = dt.getYear(timestamp);
        // string memory y = uint2str(year);
        // uint8 month = dt.getMonth(timestamp);
        // string memory m = uint2str(month);
        // uint8 day = dt.getDay(timestamp);
        // string memory d = uint2str(day);

        // string memory date = y.toSlice().concat("-".toSlice());
        // date = date.toSlice().concat(m.toSlice());
        // date = date.toSlice().concat("-".toSlice());
        // date = date.toSlice().concat(d.toSlice());

        //claimPolicyId = policyId;
        //makeRequest(location, date);
        (bool sent,) = policies[policyId].user.call{value : policies[policyId].coverageAmount}("");
        require(sent, "Transaction Failed");
        
        policies[policyId].state = policyState.PaidOut;
    }
    
    // function makeRequest(string memory _location, string memory _date) public returns (bytes32 requestId)
    // {
    //     Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
    //     req.add("path", "main");
    //     req.add("path", "humidity");
        
    //     requestId = sendChainlinkRequestTo(oracleId, req, fee);
    // }
    
    // function fulfill(bytes32 _requestId, uint256 _result)
    // public
    // recordChainlinkFulfillment(_requestId)
    // {
    //     resultReceived = true;
    //     result = _result;
        // uint payoutAmount;

        // if(policies[claimPolicyId].forFlood)
        // {
        //     if(_result < floodBaseMin)
        //         revert("There is No Flood");

        //     if(_result > floodBaseMax)
        //     {
        //         payoutAmount = uint(policies[claimPolicyId].coverageAmount * floodMaxPayout/100);
        //         policies[claimPolicyId].user.transfer(payoutAmount);
        //         policies[claimPolicyId].state = policyState.PaidOut;
        //     }
        //     else
        //     {
        //         payoutAmount = uint(policies[claimPolicyId].coverageAmount * floodBasePayout/100);
        //         policies[claimPolicyId].user.transfer(payoutAmount);
        //         policies[claimPolicyId].state = policyState.PaidOut;
        //     }
        // }
        // else
        // {
        //     if(_result > droughtBaseMax)
        //         revert("There is No Drought");

        //     if(_result < droughtBaseMin)
        //     {
        //         payoutAmount = uint(policies[claimPolicyId].coverageAmount * droughtMaxPayout/100);
        //         policies[claimPolicyId].user.transfer(payoutAmount);
        //         policies[claimPolicyId].state = policyState.PaidOut;
        //     }
        //     else
        //     {
        //         payoutAmount = uint(policies[claimPolicyId].coverageAmount * droughtBasePayout/100);
        //         policies[claimPolicyId].user.transfer(payoutAmount);
        //         policies[claimPolicyId].state = policyState.PaidOut;
        //     }
        // }

        // resetResult();
    // }
    
    
    // function uint2str(uint v) pure internal returns (string memory str) {
    //     uint maxlength = 100;
    //     bytes memory reversed = new bytes(maxlength);
    //     uint i = 0;
    //     while (v != 0) {
    //         uint remainder = v % 10;
    //         v = v / 10;
    //         reversed[i++] = bytes1(uint8(48 + remainder));
    //     }
    //     bytes memory s = new bytes(i);
    //     for (uint j = 0; j < i; j++) {
    //         s[j] = reversed[i - 1 - j];
    //     }
    //     str = string(s);
    // }
    
    
}