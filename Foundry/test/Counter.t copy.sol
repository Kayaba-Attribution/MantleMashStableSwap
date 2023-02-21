// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

// contracts
import "../src/PancakeStableSwapFactory.sol";
import "../src/StableMash.sol";
import "../src/MantleCash.sol";
import "../src/StableHelper.sol";

// interfaces
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../src/interfaces/IStableSwap.sol";
import "../src/interfaces/IStableSwapFactory.sol";
import "../src/interfaces/IPancakeswapV2Factory.sol";

import "../src/PancakeStableSwapLP.sol";
import "../src/PancakeStableSwap.sol";
//import "../src/PancakeSwapSmartRouter.sol";

import {PancakeSwapSmartRouter as Router} from "../src/PancakeSwapSmartRouter.sol";

contract FactoryTest is Test {
    address bank = address(bytes20(uint160(uint256(keccak256("bank")))));
    address team = address(bytes20(uint160(uint256(keccak256("team")))));

    IERC20 SMASH;
    IERC20 MCASH;

    PancakeStableSwapFactory stableFactory;

    function setUp() public {
        vm.label(bank, "bank");
        vm.label(team, "team");

        vm.prank(address(bank));
        SMASH = new StableMash();
        vm.prank(address(bank));
        MCASH = new MantleCash();

        vm.prank(team);
        stableFactory = new PancakeStableSwapFactory();
        require(stableFactory.owner() == team);
    }

    function testStablesDeploy() public {
        require(SMASH.balanceOf(bank) == 2_000_000 ether);
        require(MCASH.balanceOf(bank) == 2_000_000 ether);
    }

    function testFailPairCreationSameToken() public {
        stableFactory.createSwapPair(
            address(MCASH),
            address(MCASH),
            1 * 10**6,
            5 * 10**9,
            1 * 10**10
        );
    }

    function testFailPairCreationZeroToken() public {
        stableFactory.createSwapPair(
            address(0),
            address(MCASH),
            1 * 10**6,
            5 * 10**9,
            1 * 10**10
        );
    }

    uint256[2] amounts;

    function testPairCreationLiquidity() public {
        vm.prank(team);
        stableFactory.createSwapPair(
            address(SMASH),
            address(MCASH),
            1 * 10**6,
            5 * 10**9,
            1 * 10**10
        );

        // bytes memory data = abi.encodeWithSignature("createSwapPair(address,address,uint256,uint256,uint256)",
        //     address(SMASH),
        //     address(MCASH),
        //     1 * 10**6,
        //     5 * 10**9,
        //     1 * 10**10
        // );
        // address(stableFactory).call(data);
        // emit logs(data);

        IStableSwapFactory.StableSwapPairInfo memory info = IStableSwapFactory(
            address(stableFactory)
        ).getPairInfo(address(SMASH), address(MCASH));

        address swapContract = info.swapContract;

        emit log_named_address("swapContract", swapContract);

        //uint256[2] memory amounts = new uint256[](2);
        amounts[0] = 1_000_000 ether;
        amounts[1] = 1_000_000 ether;

        vm.prank(bank);
        SMASH.approve(swapContract, type(uint256).max);
        vm.prank(bank);
        MCASH.approve(swapContract, type(uint256).max);
        vm.prank(bank);

        bytes memory data = abi.encodeWithSignature(
            "add_liquidity(uint256[],uint256)",
            amounts,
            2_000_000 ether
        );
        swapContract.call(data);
        bytes memory encoded = abi.encode(amounts, 2_000_000 ether);
        emit logs(data);
        emit logs(encoded);

        PancakeStableSwapLP lpToken = PancakeStableSwap(swapContract).token();
        emit log_named_address("lpToken", address(lpToken));

        //IStableSwap(swapContract).add_liquidity(amounts, 2_000_000 ether);

        amounts[0] = 1 ether;
        amounts[1] = 1 ether;
        vm.prank(bank);
        IStableSwap(swapContract).add_liquidity(amounts, 1 ether);
    }

    function deployStableSwap() public returns (address) {
        vm.prank(team);
        stableFactory.createSwapPair(
            address(SMASH),
            address(MCASH),
            1 * 10**6,
            5 * 10**9,
            1 * 10**10
        );

        vm.prank(bank);
        StableHelper helper = new StableHelper();

        IStableSwapFactory.StableSwapPairInfo memory info = IStableSwapFactory(
            address(stableFactory)
        ).getPairInfo(address(SMASH), address(MCASH));

        address swapContract = info.swapContract;

        amounts[0] = 1_000_000 ether;
        amounts[1] = 1_000_000 ether;

        vm.prank(bank);
        SMASH.approve(address(helper), type(uint256).max);
        vm.prank(bank);
        MCASH.approve(address(helper), type(uint256).max);

        vm.prank(bank);
        helper.addLiquidity(
            swapContract,
            address(SMASH),
            address(MCASH),
            1_000_000 ether,
            1_000_000 ether,
            2_000_000 ether
        );
        //IStableSwap(swapContract).add_liquidity(amounts, 2_000_000 ether);

        return swapContract;
    }

    function testSwap() public {
        address swapContract = deployStableSwap();

        vm.prank(address(bank));
        Router router = new Router(
            address(33333),
            address(44444),
            address(stableFactory)
        );

        // transfer 1000 SMASH
        vm.prank(address(bank));
        address bob = address(777);
        SMASH.transfer(bob, 1000 ether);

        // Bob approves the router
        vm.prank(address(bob));
        SMASH.approve(address(router), type(uint256).max);
        emit log_named_uint("Bob SMASH before", SMASH.balanceOf(bob));
        emit log_named_uint("Bob MCASH after", MCASH.balanceOf(bob));
        // Bob swaps the 1000 tokens
        vm.prank(address(bob));
        router.swap(SMASH, MCASH, 500 ether, 0, 0);
        emit log_named_uint("Bob SMASH before", SMASH.balanceOf(bob));
        emit log_named_uint("Bob MCASH after", MCASH.balanceOf(bob));

        /*
        IERC20 srcToken = MCASH;
        IERC20 dstToken = SMASH;

        // creates interface
        IStableSwap stableSwap = IStableSwap(swapContract);
        // builds params
        IERC20[] memory tokens = new IERC20[](2);
        tokens[0] = IERC20(stableSwap.coins(uint256(0)));
        tokens[1] = IERC20(stableSwap.coins(uint256(1)));
        // more params
        uint256 i = (srcToken == tokens[0] ? 1 : 0) +
            (srcToken == tokens[1] ? 2 : 0);
        uint256 j = (dstToken == tokens[0] ? 1 : 0) +
            (dstToken == tokens[1] ? 2 : 0);

        //srcToken.uniApprove(address(stableSwap), amount);
        vm.prank(bank);
        stableSwap.exchange(i - 1, j - 1, 1 ether, 0);
        */
    }

    function testDrip() public {
        bytes memory data = abi.encodeWithSignature("drip()");
        vm.roll(16642384);
        emit log_named_uint("block", block.timestamp);

        vm.prank(address(15));
        address(SMASH).call(data);

        vm.prank(address(15));
        address(SMASH).call(data);
    }
}
