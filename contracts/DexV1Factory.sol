// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IDexV1factory.sol";
import "./DexV1Pair.sol";

contract DexV1factory is IDexV1factory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function createPair(
        address tokenA,
        address tokenB
    ) external returns (address pair) {
        require(tokenA != tokenB, "DexV1: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "DexV1: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "DexV1: PAIR_EXISTS");
        bytes memory bytecode = type(DexV1Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IDexV1Pair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair;
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "DexV1: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "DexV1: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}
