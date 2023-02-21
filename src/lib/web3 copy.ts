import { ethers } from 'ethers';
import { onDestroy } from 'svelte';
import { writable } from "svelte/store";
import { defaultEvmStores, signerAddress } from 'svelte-ethers-store';
import { Contract } from "@ethersproject/contracts";
import { routerABI, tokenABI, usdcABI, divsABI, wcroABI} from '$lib/abis.js';

// @ts-ignore
import { formatEther, parseEther } from '@ethersproject/units';
// @ts-ignore
import { spotUSD, spotMTR, spotUSDforTickerCoinGecko } from '$lib/ethUtils';
// Web3modal instance
// @ts-ignore
let web3Modal;

// Chosen wallet provider given by the dialog window
// @ts-ignore
let provider;

// User Wallet
let wallet: string;
let jsProvider;
let jsSigner;

import botInfo from "$lib/VolumeBot.json" 

/**
 * Setup the orchestra
 */
export async function init() {
  // @ts-ignore
  const WalletConnectProvider = window.WalletConnectProvider.default;
  
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  // @ts-ignore
  console.log("window.web3 is", ethers, "window.ethereum is", window.ethereum);
  
  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  
  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          97: 'https://data-seed-prebsc-1-s3.binance.org:8545'
        }
      }
    },
  };
  
  // @ts-ignore
  web3Modal = new window.Web3Modal.default({
    cacheProvider: true, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });
  
  if (web3Modal.cachedProvider) {
    provider = await web3Modal.connect();
    defaultEvmStores.setProvider(provider);
  }
  console.log("Web3Modal instance is", web3Modal);
}

const adrs = {
  SMASH: '0x9Ed8382f7780A7984Aa41C51C8E1AFF969dD7Ede',
  MCASH: '0x4c6Ab66dF1A7A0bda357BE5092404c97ce6eD915',
  router: '0x7189e14E5073655b2bd460751eC7393a6E85099c',
  factory: '0x052723AF8ac2A0aBfa999f4d6c5C2Ea5Ec6076f3',
  swapContract: '0xE3E51E157CF89f68973b6d18e81357be7fF2D407'
}

const customContracts = {};
export function loadContracts() {
  // @ts-ignore
  defaultEvmStores.attachContract('token', adrs.token, tokenABI)
  //console.log(customContracts)
  console.log("🌸 loadContracts 🚀")

}

export const userBalanceUSD = writable(0)
export const userBalanceNative = writable(0)

export async function spotBalanceUpdate (){
  console.log(`💰 spotBalanceUpdate for: ${wallet.slice(0,8)} 💰`)
  // @ts-ignore
  let _nativeBalance = Number(formatEther(await jsProvider.getBalance(wallet))).toFixed(2)
  // @ts-ignore
  let _usdBalance = (_nativeBalance * (await spotUSDforTickerCoinGecko("crypto-com-chain")))+ ' USD'
  // @ts-ignore
  userBalanceUSD.set(_usdBalance);
  // @ts-ignore
  userBalanceNative.set(_nativeBalance);
}

// IN USE 
export const tokenSupply = writable(0)
export const userPaidEarnings = writable(0)
export const userBalanceToken = writable(0)
export const userBalanceWCRO = writable(0)
export const userBalanceBUSD = writable(0)
export const divBalanceUSDC = writable(0)
export const tokenPrice = writable(0)
export const minDistribution = writable(0)
export const userUnpaidEarnings = writable(0)
export const errorLog = writable("")
export const totalRewardsDistributed = writable(0)
export const botStatus = writable(0)


import {
  Multicall,
  ContractCallResults,
  ContractCallContext
} from 'ethereum-multicall';

let multicall;



export async function core() {
  console.log("CORE RUN 🚀")

    if(jsProvider == undefined){
      console.log("CORE HOTRELOAD 🚀")
      await onConnect()
    }

  let blockNow = await jsProvider.getBlockNumber();
  console.log("Running multicall on block:", blockNow)
  const contractCallContext: ContractCallContext[] = [
    {
        reference: 'tokenContract',
        contractAddress: adrs.token,
        abi: tokenABI,
        calls: [
          { reference: 'uTokenBal', methodName: 'balanceOf', methodParameters: [wallet] }
        ]
    },
    {
      reference: 'wcroContract',
      contractAddress: adrs.wcro,
      abi: wcroABI,
      calls: [
        { reference: 'uWcroBal', methodName: 'balanceOf', methodParameters: [wallet] },
        { reference: 'uWcroBal', methodName: 'balanceOf', methodParameters: [adrs.divs] }

      ]
    },
    {
      reference: 'routerContract',
      contractAddress: adrs.router,
      abi: routerABI,
      calls: [
        { reference: 'price', methodName: 'getAmountsOut', methodParameters: ["1000000000", [adrs.token, adrs.wcro, adrs.usdc]] }

      ]
    },
    {
      reference: 'divsContract',
      contractAddress: adrs.divs,
      abi: divsABI,
      calls: [
        { reference: 'dividents', methodName: 'withdrawableDividendOf', methodParameters: [wallet] },
        { reference: 'dividents', methodName: 'withdrawnDividendOf', methodParameters: [wallet] },
        { reference: 'dividents', methodName: 'totalDividendsDistributed', methodParameters: [] },
        //0xdd7f3b5d68ed54bcf2847d15ce5a9bb8784bf637
      ]
    }
  ];

  const results: ContractCallResults = await multicall.call(contractCallContext,{ blockNumber: blockNow });
  console.log(results);

  let userTokenBalance = parseInt(results.results.tokenContract.callsReturnContext[0].returnValues[0].hex, 16)/ 10 ** 9
  console.log("COG Balance \n", userTokenBalance)
  userBalanceToken.set(Number(userTokenBalance).toFixed(2))
  userBalanceWCRO.set((parseInt(results.results.wcroContract.callsReturnContext[0].returnValues[0].hex, 16)/ 10 ** 18).toFixed(2))
  divBalanceUSDC.set((parseInt(results.results.wcroContract.callsReturnContext[1].returnValues[0].hex, 16)/ 10 ** 18).toFixed(2))


  let tokenPriceCall = results.results.routerContract.callsReturnContext[0].returnValues[2].hex
  tokenPrice.set((parseInt(tokenPriceCall, 16)/10 ** 6))
  console.log("COG tokenPrice: ", parseInt(tokenPriceCall, 16)/10 ** 6)
  tokenSupply.set(100000000)

  let rewardCall = (parseInt(results.results.divsContract.callsReturnContext[0].returnValues[0].hex, 16)/ 10 ** 18).toFixed(2)
  console.log("withdrawableDividendOf: ", rewardCall)
  userUnpaidEarnings.set(rewardCall)
  let claimedCall = (parseInt(results.results.divsContract.callsReturnContext[1].returnValues[0].hex, 16)/ 10 ** 18).toFixed(2)
  userPaidEarnings.set(claimedCall);

  let totalClaimedCall = (parseInt(results.results.divsContract.callsReturnContext[2].returnValues[0].hex, 16)/ 10 ** 18).toFixed(2)
  console.log(totalClaimedCall)
  totalRewardsDistributed.set(totalClaimedCall);

    console.log("CORE RUN DONE 🚀")
}

let hooksLoaded = false;
async function transferHook(from, to, value) {
  console.log(`⚠️ Transfer detected ${from}, ${to}, ${value}`)
  await core();
}

export default function loadHooks() {
  if(hooksLoaded) return;
  hooksLoaded = true;
  console.log("🔋 Transfer hooksLoaded 🚀")


  contracts.token.off("Transfer");
  contracts.token.on("Transfer", transferHook);
}

export async function loadBot() {
  defaultEvmStores.attachContract('bot', adrs.bot, botInfo.abi)
  botStatus.set(1)
  console.log("🌸 Bot Start 🚀")
}


/**
 * Connect wallet button pressed.
 */
export async function onConnect(_type) {

  // @ts-ignore
  console.log("Opening a dialog", web3Modal);
  try {
    // @ts-ignore
    provider = await web3Modal.connect();
    /* --- GETS WALLET AND SAVES IT ---*/
    jsProvider = new ethers.providers.Web3Provider(provider);
    jsSigner = jsProvider.getSigner();
    wallet = await jsSigner.getAddress();
    console.log(`🔥 ${wallet.slice(0,8)} is connected 🔥`)

    defaultEvmStores.setProvider(provider);

    if (_type == "main") {

      // ! Load Multicall
      try {
        multicall = new Multicall({ ethersProvider: jsProvider, tryAggregate: true });
        console.log("🔥 multicall on 🔥")
      } catch (e) {
        console.log("❌ err loading multicall ❌", e);
      }

      // ! Main app loop 
      try {
        await core()
        await loadContracts()
        await loadHooks()
      } catch (e) {
        console.log()
      }
    } else {
      await loadBot();
    }
    /* ------------------------------- */
    // @ts-ignore
    //console.log(defaultEvmStores.$selectedAccount)
  } catch(e) {
    console.log("❌ Could not get a wallet connection ❌", e);
    return;
  }
  try {
    spotBalanceUpdate()
  } catch (e) {
    console.log("❌ Could not get a wallet balances ❌", e);
    return;
  }

}


/**
 * Disconnect wallet button pressed.
 */
export async function onDisconnect() {

  // @ts-ignore
  console.log("❌ Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  // @ts-ignore
  if (provider.close) {
    // @ts-ignore
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
  }
  // @ts-ignore
  await web3Modal.clearCachedProvider();
  defaultEvmStores.disconnect();
  provider = null;

}