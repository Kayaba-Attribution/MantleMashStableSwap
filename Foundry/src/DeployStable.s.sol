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
    address caller = 0x2002469Ae0068e8863a7531B5FFD56E283752D8F;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Stables
        SMASH = new StableMash();
        MCASH = new MantleCash();

        // StableSwap Pairs Factory
        stableFactory = new PancakeStableSwapFactory();

        // StableSwap Router
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
        stableFactory.createSwapPair(
            address(SMASH),
            address(MCASH),
            1 * 10**6,
            5 * 10**9,
            1 * 10**10
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
        SMASH.approve(address(swapContract), type(uint256).max);
        MCASH.approve(address(swapContract), type(uint256).max);

        // Add liquidity
        IStableSwap(swapContract).add_liquidity(amounts, 2_000_000 ether);

        emit log_named_uint("LP USER:", IStableSwap(swapContract).checkLpBalance(caller));


        // Approve Router
        SMASH.approve(address(router), type(uint256).max);
        MCASH.approve(address(router), type(uint256).max);

        router.swap(SMASH, MCASH, 1000 ether, 0, 0);

        vm.stopBroadcast();
    }
}
