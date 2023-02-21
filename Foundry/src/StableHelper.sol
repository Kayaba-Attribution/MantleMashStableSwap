// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// contracts
import "@openzeppelin/contracts/access/Ownable.sol";
import "../src/StableMash.sol";
import "../src/MantleCash.sol";
import "../src/PancakeStableSwapLP.sol";
import "../src/PancakeStableSwap.sol";

// interfaces
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../src/interfaces/IStableSwap.sol";
import "../src/interfaces/IStableSwapFactory.sol";
import "../src/interfaces/IPancakeswapV2Factory.sol";

contract StableHelper is Ownable {
    uint256[2] amounts;

    function addLiquidity(
        address swapContract,
        address A,
        address B,
        uint256 amountA,
        uint256 amountB,
        uint256 min
    ) public onlyOwner {
        IERC20(A).approve(swapContract, type(uint256).max);
        IERC20(B).approve(swapContract, type(uint256).max);

        IERC20(A).transferFrom(msg.sender, address(this), amountA);
        IERC20(B).transferFrom(msg.sender, address(this), amountB);

        amounts[0] = amountA;
        amounts[1] = amountB;

        //bytes memory data = abi.encodeWithSignature(
        //    "add_liquidity(uint256[],uint256)",
        //    amounts,
        //    min
        //);
        //swapContract.call(data);

        IStableSwap(swapContract).add_liquidity(amounts, min);


        PancakeStableSwapLP lpToken = PancakeStableSwap(swapContract).token();
        lpToken.approve(address(this), type(uint256).max);
        lpToken.transfer(msg.sender, lpToken.balanceOf(address(this)));
    }
}
