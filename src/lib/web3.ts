import { ethers } from 'ethers';
import { onDestroy } from 'svelte';
import { writable } from "svelte/store";
import { defaultEvmStores, signerAddress } from 'svelte-ethers-store';
import { Contract } from "@ethersproject/contracts";
import { routerABI, tokenABI, usdcABI, divsABI, sRouterABI, stableABI} from '$lib/abis.js';

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

import makeBlockie from 'ethereum-blockies-base64';


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
          5001: 'https://rpc.testnet.mantle.xyz/'
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
  SMASH: '0x6Bbab635b376F9880be2EF241c7886940A4d68Ff',
  MCASH: '0xc6CEf33E3D6dA5956E3973fF24725FFb06d51532',
  router: '0x98F9687D62b658aFc0123eCA5668f1dd39B0444c',
  factory: '0x95a81D811Ea00d100c26cb8D77444c9eE8F429B0',
  swapContract: '0xd24348bb374299B3BBc93A4f0D69B8e6f16EA047'
}

const customContracts = {};
export function loadContracts() {
  // @ts-ignore
  defaultEvmStores.attachContract('SMASH', adrs.SMASH, stableABI);
  defaultEvmStores.attachContract('MCASH', adrs.MCASH, stableABI);
  defaultEvmStores.attachContract('ROUTER', adrs.router, sRouterABI);
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
  //let _usdBalance = (_nativeBalance * (await spotUSDforTickerCoinGecko("crypto-com-chain")))+ ' USD'
  let _usdBalance = (_nativeBalance * 0.635).toFixed(2) + ' USD'
  // @ts-ignore
  userBalanceUSD.set(_usdBalance);
  // @ts-ignore
  userBalanceNative.set(_nativeBalance);
}

// IN USE 
export const blockie = writable("")
// not used
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

let multicall: Multicall;



export async function core() {
  console.log("CORE RUN 🚀")

    if(jsProvider == undefined){
      console.log("CORE HOTRELOAD 🚀")
      await onConnect()
    }

  let blockNow = await jsProvider.getBlockNumber();
  console.log("Running multicall on block:", blockNow, wallet, adrs.SMASH)

  const contractCallContext: ContractCallContext[] = [
    {
        reference: 'SMASH',
        contractAddress: adrs.SMASH,
        abi: stableABI,
        calls: [
          { reference: 'uTokenBal', methodName: 'balanceOf', methodParameters: [wallet] }
        ]
    }
  ];

  const results: ContractCallResults = await multicall.call(contractCallContext,{ blockNumber: blockNow });
  console.log(results);

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
export async function onConnect(_type: string) {

  // @ts-ignore
  console.log("Opening a dialog", web3Modal);
  try {
    // @ts-ignore
    provider = await web3Modal.connect();
    /* --- GETS WALLET AND SAVES IT ---*/
    jsProvider = new ethers.providers.Web3Provider(provider);
    jsSigner = jsProvider.getSigner();
    wallet = await jsSigner.getAddress();
    let walletIcon = makeBlockie(wallet);
    blockie.set(walletIcon)
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
        //await core()
        //await loadContracts()
        await loadHooks()
      } catch (e) {
        console.log()
      }
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