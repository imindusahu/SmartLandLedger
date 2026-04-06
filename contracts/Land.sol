// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Land {
    struct Landreg {
        uint id;
        uint area;
        string city;
        string state;
        uint landPrice;
        uint propertyPID;
        uint physicalSurveyNumber;
        string ipfsHash;
        string document;
        address buyer;
        uint createdAt;
    }

    struct LandView {
        uint id;
        string location;
        uint area;
        uint price;
        address seller;
        address buyer;
        bool verified;
        uint createdAt;
    }

    struct Buyer{
        address id;
        string name;
        uint age;
        string city;
        string aadharNumber;
        string panNumber;
        string document;
        string email;
    }

    struct Seller{
        address id;
        string name;
        uint age;
        string aadharNumber;
        string panNumber;
        string landsOwned;
        string document;
    }

    struct LandInspector {
        uint id;
        string name;
        uint age;
        string designation;
    }

    struct LandRequest{
        uint reqId;
        address sellerId;
        address buyerId;
        uint landId;
        // bool requestStatus;
        // bool requested;
    }

    //key value pairs
    mapping(uint => Landreg) public lands;
    mapping(uint => LandInspector) public InspectorMapping;
    mapping(address => Seller) public SellerMapping;
    mapping(address => Buyer) public BuyerMapping;
    mapping(uint => LandRequest) public RequestsMapping;

    mapping(address => bool) public RegisteredAddressMapping;
    mapping(address => bool) public RegisteredSellerMapping;
    mapping(address => bool) public RegisteredBuyerMapping;
    mapping(address => bool) public SellerVerification;
    mapping(address => bool) public SellerRejection;
    mapping(address => bool) public BuyerVerification;
    mapping(address => bool) public BuyerRejection;
    mapping(uint => bool) public LandVerification;
    mapping(uint => address) public LandOwner;
    mapping(uint => bool) public RequestStatus;
    mapping(uint => bool) public RequestedLands;
    mapping(uint => bool) public PaymentReceived;

    address public Land_Inspector;
    address[] public sellers;
    address[] public buyers;

    uint public landsCount;
    uint public inspectorsCount;
    uint public sellersCount;
    uint public buyersCount;
    uint public requestsCount;

    event Registration(address _registrationId);
    event AddingLand(uint indexed _landId);
    event Landrequested(address _sellerId);
    event requestApproved(address _buyerId);
    event Verified(address _id);
    event Rejected(address _id);

    constructor() {
        Land_Inspector = msg.sender;
        addLandInspector("Inspector 1", 45, "Tehsil Manager");
    }

    function addLandInspector(string memory _name, uint _age, string memory _designation) private {
        inspectorsCount++;
        InspectorMapping[inspectorsCount] = LandInspector(inspectorsCount, _name, _age, _designation);
    }

    function getLandsCount() public view returns (uint) {
        return landsCount;
    }

    function getBuyersCount() public view returns (uint) {
        return buyersCount;
    }

    function getSellersCount() public view returns (uint) {
        return sellersCount;
    }

    function getRequestsCount() public view returns (uint) {
        return requestsCount;
    }
    function getArea(uint i) public view returns (uint) {
        return lands[i].area;
    }
    function getCity(uint i) public view returns (string memory) {
        return lands[i].city;
    }
     function getState(uint i) public view returns (string memory) {
        return lands[i].state;
    }
    // function getStatus(uint i) public view returns (bool) {
    //     return lands[i].verificationStatus;
    // }
    function getPrice(uint i) public view returns (uint) {
        return lands[i].landPrice;
    }
    function getPID(uint i) public view returns (uint) {
        return lands[i].propertyPID;
    }
    function getSurveyNumber(uint i) public view returns (uint) {
        return lands[i].physicalSurveyNumber;
    }
    function getImage(uint i) public view returns (string memory) {
        return lands[i].ipfsHash;
    }
    function getDocument(uint i) public view returns (string memory) {
        return lands[i].document;
    }
    
    function getLandOwner(uint id) public view returns (address) {
        return LandOwner[id];
    }

    function verifySeller(address _sellerId) public{
        require(isLandInspector(msg.sender));

        SellerVerification[_sellerId] = true;
        emit Verified(_sellerId);
    }

    function rejectSeller(address _sellerId) public{
        require(isLandInspector(msg.sender));

        SellerRejection[_sellerId] = true;
        emit Rejected(_sellerId);
    }

    function verifyBuyer(address _buyerId) public{
        require(isLandInspector(msg.sender));

        BuyerVerification[_buyerId] = true;
        emit Verified(_buyerId);
    }

    function rejectBuyer(address _buyerId) public{
        require(isLandInspector(msg.sender));

        BuyerRejection[_buyerId] = true;
        emit Rejected(_buyerId);
    }
    
    function verifyLand(uint _landId) public{
        require(isLandInspector(msg.sender));

        LandVerification[_landId] = true;
    }

    function isLandVerified(uint _id) public view returns (bool) {
        return LandVerification[_id];
    }

    function isVerified(address _id) public view returns (bool) {
        return SellerVerification[_id] || BuyerVerification[_id];
    }

    function isRejected(address _id) public view returns (bool) {
        return SellerRejection[_id] || BuyerRejection[_id];
    }

    function isSeller(address _id) public view returns (bool) {
        return RegisteredSellerMapping[_id];
    }

    function isLandInspector(address _id) public view returns (bool) {
        return Land_Inspector == _id;
    }

    function isBuyer(address _id) public view returns (bool) {
        return RegisteredBuyerMapping[_id];
    }
    function isRegistered(address _id) public view returns (bool) {
        return RegisteredAddressMapping[_id];
    }

    function registerLand(string memory _location, uint _area, uint _price) public {
        addLand(_area, _location, "", _price, 0, 0, "", "");
    }

    function addLand(uint _area, string memory _city,string memory _state, uint landPrice, uint _propertyPID,uint _surveyNum,string memory _ipfsHash, string memory _document) public {
        require((isSeller(msg.sender)) && (isVerified(msg.sender)));
        landsCount++;
        lands[landsCount] = Landreg(landsCount, _area, _city, _state, landPrice, _propertyPID, _surveyNum, _ipfsHash, _document, address(0), block.timestamp);
        LandOwner[landsCount] = msg.sender;
        // emit AddingLand(landsCount);
    }

    function getAllLands() public view returns (LandView[] memory) {
        LandView[] memory allLands = new LandView[](landsCount);
        for (uint i = 1; i <= landsCount; i++) {
            Landreg storage current = lands[i];
            allLands[i - 1] = LandView(
                current.id,
                current.city,
                current.area,
                current.landPrice,
                LandOwner[i],
                current.buyer,
                LandVerification[i],
                current.createdAt
            );
        }
        return allLands;
    }

    function getLandsByOwner(address _owner) public view returns (LandView[] memory) {
        uint count = 0;
        for (uint i = 1; i <= landsCount; i++) {
            if (LandOwner[i] == _owner || lands[i].buyer == _owner) {
                count++;
            }
        }

        LandView[] memory ownerLands = new LandView[](count);
        uint index = 0;
        for (uint i = 1; i <= landsCount; i++) {
            if (LandOwner[i] == _owner || lands[i].buyer == _owner) {
                Landreg storage current = lands[i];
                ownerLands[index] = LandView(
                    current.id,
                    current.city,
                    current.area,
                    current.landPrice,
                    LandOwner[i],
                    current.buyer,
                    LandVerification[i],
                    current.createdAt
                );
                index++;
            }
        }
        return ownerLands;
    }

    function requestLand(uint _landId) public payable {
        require(isBuyer(msg.sender) && isVerified(msg.sender), "Buyer must be verified");
        require(_landId > 0 && _landId <= landsCount, "Invalid land id");

        address seller = LandOwner[_landId];
        require(seller != address(0), "Land not found");
        require(seller != msg.sender, "Cannot request your own land");
        require(msg.value >= lands[_landId].landPrice, "Insufficient payment");

        requestsCount++;
        RequestsMapping[requestsCount] = LandRequest(requestsCount, seller, msg.sender, _landId);
        RequestStatus[requestsCount] = false;
        RequestedLands[requestsCount] = true;

        payment(payable(seller), _landId);
        lands[_landId].buyer = msg.sender;
    }

    function makePayment(uint _landId) public payable {
        require(_landId > 0 && _landId <= landsCount, "Invalid land id");
        require(msg.value >= lands[_landId].landPrice, "Insufficient payment");
        address seller = LandOwner[_landId];
        require(seller != address(0), "Land not found");
        payment(payable(seller), _landId);
    }

    //registration of seller
    function registerSeller(string memory _name, uint _age, string memory _aadharNumber, string memory _panNumber, string memory _landsOwned, string memory _document) public {
        //require that Seller is not already registered
        require(!RegisteredAddressMapping[msg.sender]);

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredSellerMapping[msg.sender] = true ;
        sellersCount++;
        SellerMapping[msg.sender] = Seller(msg.sender, _name, _age, _aadharNumber,_panNumber, _landsOwned, _document);
        sellers.push(msg.sender);
        emit Registration(msg.sender);
    }

    function updateSeller(string memory _name, uint _age, string memory _aadharNumber, string memory _panNumber, string memory _landsOwned) public {
        //require that Seller is already registered
        require(RegisteredAddressMapping[msg.sender] && (SellerMapping[msg.sender].id == msg.sender));

        SellerMapping[msg.sender].name = _name;
        SellerMapping[msg.sender].age = _age;
        SellerMapping[msg.sender].aadharNumber = _aadharNumber;
        SellerMapping[msg.sender].panNumber = _panNumber;
        SellerMapping[msg.sender].landsOwned = _landsOwned;

    }

    function getSeller() public view returns( address [] memory ){
        return(sellers);
    }

    function getSellerDetails(address i) public view returns (string memory, uint, string memory, string memory, string memory, string memory) {
        return (SellerMapping[i].name, SellerMapping[i].age, SellerMapping[i].aadharNumber, SellerMapping[i].panNumber, SellerMapping[i].landsOwned, SellerMapping[i].document);
    }

    function registerBuyer(string memory _name, uint _age, string memory _city, string memory _aadharNumber, string memory _panNumber, string memory _document, string memory _email) public {
        //require that Buyer is not already registered
        require(!RegisteredAddressMapping[msg.sender]);

        RegisteredAddressMapping[msg.sender] = true;
        RegisteredBuyerMapping[msg.sender] = true ;
        buyersCount++;
        BuyerMapping[msg.sender] = Buyer(msg.sender, _name, _age, _city, _aadharNumber, _panNumber, _document, _email);
        buyers.push(msg.sender);

        emit Registration(msg.sender);
    }

    function updateBuyer(string memory _name,uint _age, string memory _city,string memory _aadharNumber, string memory _email, string memory _panNumber) public {
        //require that Buyer is already registered
        require(RegisteredAddressMapping[msg.sender] && (BuyerMapping[msg.sender].id == msg.sender));

        BuyerMapping[msg.sender].name = _name;
        BuyerMapping[msg.sender].age = _age;
        BuyerMapping[msg.sender].city = _city;
        BuyerMapping[msg.sender].aadharNumber = _aadharNumber;
        BuyerMapping[msg.sender].email = _email;
        BuyerMapping[msg.sender].panNumber = _panNumber;
        
    }

    function getBuyer() public view returns( address [] memory ){
        return(buyers);
    }

    function getBuyerDetails(address i) public view returns ( string memory,string memory, string memory, string memory, string memory, uint, string memory) {
        return (BuyerMapping[i].name,BuyerMapping[i].city , BuyerMapping[i].panNumber, BuyerMapping[i].document, BuyerMapping[i].email, BuyerMapping[i].age, BuyerMapping[i].aadharNumber);
    }


    function requestLand(address _sellerId, uint _landId) public{
        require(isBuyer(msg.sender) && isVerified(msg.sender));
        
        requestsCount++;
        RequestsMapping[requestsCount] = LandRequest(requestsCount, _sellerId, msg.sender, _landId);
        RequestStatus[requestsCount] = false;
        RequestedLands[requestsCount] = true;

        emit Landrequested(_sellerId);
    }

    function getRequestDetails (uint i) public view returns (address, address, uint, bool) {
        return(RequestsMapping[i].sellerId, RequestsMapping[i].buyerId, RequestsMapping[i].landId, RequestStatus[i]);
    }

    function isRequested(uint _id) public view returns (bool) {
        return RequestedLands[_id];
    }

    function isApproved(uint _id) public view returns (bool) {
        return RequestStatus[_id];
    }

    function approveRequest(uint _reqId) public {
        require((isSeller(msg.sender)) && (isVerified(msg.sender)));
       
        RequestStatus[_reqId] = true;

    }

    function LandOwnershipTransfer(uint _landId, address _newOwner) public{
        require(isLandInspector(msg.sender));

        LandOwner[_landId] = _newOwner;
    }

    function isPaid(uint _landId) public view returns (bool) {
        return PaymentReceived[_landId];
    }

    function payment(address payable _receiver, uint _landId) public payable {
        PaymentReceived[_landId] = true;
        _receiver.transfer(msg.value);
    }



}
