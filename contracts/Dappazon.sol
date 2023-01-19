// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Dappazon {
    address public owner;

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;

    mapping(address => uint256) public orderCount;
    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint256 quantity);
    event Buy(address buyer, uint256 orderId, uint256 itemId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can add product");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // list product
    function listProduct(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );
        items[_id] = item;
        emit List(_name, _cost, _stock);
    }

    // buy products

    function buy(uint256 _id) public payable {
        // fetch item
        Item memory item = items[_id];
        // check item is in stock
        require(item.stock > 0, "Out of Stock");
        require(msg.value >= item.cost, "Please send more ethers");
        // create order
        Order memory order = Order(block.timestamp, item);
        // save order
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;
        // substract stock
        item.stock--;
        // emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    // withdraw funds to creater account
    function withdraw() public onlyOwner {
        (bool sucess, ) = owner.call{value: address(this).balance}("");
        require(sucess, "Not able to execute transaction");
    }

    receive() external payable {}

    fallback() external payable {}
}
