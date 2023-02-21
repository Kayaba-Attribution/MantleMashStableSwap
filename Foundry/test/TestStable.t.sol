// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
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

contract DeployStable is Script, Test {
    IERC20 SMASH;
    IERC20 MCASH;
    uint256[2] amounts;

    PancakeStableSwapFactory stableFactory;

    function testAll() external {
        //uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        //vm.startBroadcast(deployerPrivateKey);
        address team = address(bytes20(uint160(uint256(keccak256("team")))));
        address bob = address(bytes20(uint160(uint256(keccak256("bob")))));

        // Deploy Stables
        vm.prank(team);
        SMASH = new StableMash();
        vm.prank(team);
        MCASH = new MantleCash();

        // StableSwap Pairs Factory
        vm.prank(team);
        stableFactory = new PancakeStableSwapFactory();

        // StableSwap Router
        vm.prank(team);
        Router router = new Router(
            address(0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111),
            address(0),
            address(stableFactory)
        );

        emit log_named_address("SMASH", address(SMASH));
        emit log_named_address("MCASH", address(MCASH));
        emit log_named_address("StableFactory", address(stableFactory));
        emit log_named_address("Router", address(router));

        // Create SMASH/MCASH pair
        vm.prank(team);
        stableFactory.createSwapPair(
            address(SMASH),
            address(MCASH),
            1000,
            4000000,
            5000000000
        );

        // Get address of the swap contract
        IStableSwapFactory.StableSwapPairInfo memory info = IStableSwapFactory(
            address(stableFactory)
        ).getPairInfo(address(SMASH), address(MCASH));

        address swapContract = info.swapContract;
        emit log_named_address("swapContract", address(swapContract));

        // Setup amounts for liq
        amounts[0] = 1_000_000 ether;
        amounts[1] = 1_000_000 ether;

        // Approve swapContract
        vm.prank(team);
        SMASH.approve(address(swapContract), type(uint256).max);
        vm.prank(team);
        MCASH.approve(address(swapContract), type(uint256).max);

        // Add liquidity
        vm.prank(team);
        IStableSwap(swapContract).add_liquidity(amounts, 2_000_000 ether);

        // Approve Router
        vm.prank(team);
        SMASH.approve(address(router), type(uint256).max);
        vm.prank(team);
        MCASH.approve(address(router), type(uint256).max);

        emit log_named_uint("T SMASH before", SMASH.balanceOf(team));
        emit log_named_uint("T MCASH before", MCASH.balanceOf(team));
        vm.prank(team);
        router.swap(SMASH, MCASH, 1000 ether, 0, 0);
        emit log_named_uint("T SMASH after", SMASH.balanceOf(team));
        emit log_named_uint("T MCASH after", MCASH.balanceOf(team));

        vm.prank(bob);
        SMASH.approve(address(router), type(uint256).max);
        vm.prank(team);
        SMASH.transfer(bob, 1000 ether);
        //bytes memory data = abi.encodeWithSignature("drip()");
        //address(SMASH).call(data);
        
        emit log_named_uint("BOB SMASH before", SMASH.balanceOf(bob));
        emit log_named_uint("BOB MCASH before", MCASH.balanceOf(bob));
        vm.prank(bob);
        router.swap(SMASH, MCASH, 1000 ether, 0, 0);
        emit log_named_uint("BOB SMASH after", SMASH.balanceOf(bob));
        emit log_named_uint("BOB MCASH after", MCASH.balanceOf(bob));


        //vm.stopBroadcast();
    }
}

