// @ts-nocheck
import { writable } from "svelte/store";
import { formatEther, parseEther } from '@ethersproject/units';


export async function spotUSD(_symbol){
    let response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol='+_symbol +'USDT');
    response = await response.json();
    let price = Number(response.price).toFixed(2)
    console.log(`💲 ${_symbol} to USD: ${price} USD 💲`)
    return price
}

export async function spotMTR(){
    let response = await fetch('https://api.coingecko.com/api/v3/coins/meter-stable');
    response = await response.json();
    let price = Number(response.market_data.current_price.usd).toFixed(2)
    console.log(`💲 MTR to USD: ${price} USD 💲`)
    return price
}

export async function spotUSDforTickerCoinGecko(_symbol){
    let response = await fetch('https://api.coingecko.com/api/v3/coins/'+ _symbol);
    response = await response.json();
    let price = Number(response.market_data.current_price.usd).toFixed(2)
    console.log(`💲 ${_symbol} to USD: ${price} USD 💲`)
    return price
}

export async function updateNativeBalanceUSD(_balance){
    let res = _balance
}

export function formatDate(timestamp){
    return new Date(timestamp * 1000).toLocaleString([],{year: 'numeric', month: 'numeric', day: 'numeric'})
}

export async function txStats(_data){
    let ethTxns = []
    let totalETH = 0

    let ercTxns = []
    let totalERC = 0

    let nftsTxns = []
    let totalNFTs = 0;

    _data.results.forEach(e => {
        if (e.type == 'ETHER_TRANSFER') {
            let val = Number(formatEther(e.value))
            totalETH += val;
            ethTxns.push({
                'from': e.from, 
                'value': val,
                'link': 'https://etherscan.io/tx/' + e.transactionHash
            })
        } else if (e.type == 'ERC20_TRANSFER') {
            let val = (e.tokenInfo.decimals == 18) ? Number(formatEther(e.value)).toFixed(3) : Number(e.value/10**e.tokenInfo.decimals).toFixed(3)
            totalERC += Number(val);
            ercTxns.push({
                'from': e.from, 
                'tokenAddress': e.tokenInfo.address,
                'quantity': val,
                'symbol': e.tokenInfo.symbol,
                'link': 'https://etherscan.io/tx/' + e.transactionHash
            })
        } else if (e.type == 'ERC721_TRANSFER') {
            totalNFTs ++;
            nftsTxns.push({
                'from': e.from, 
                'contract': e.tokenAddress,
                'id': e.tokenId,
                'link': 'https://etherscan.io/tx/' + e.transactionHash,
                'name': e.tokenInfo.name
            })
        }
        //console.log(e.to)
    })
    // sort by higher to lower amount
    ethTxns.sort(function (a, b) {
        return b.value - a.value;
    });
    ercTxns.sort(function (a, b) {
        return b.quantity - a.quantity;
    });

    //console.log('\n\n\n[Total ETH]', totalETH, 'ETH Recieved In', ethTxns.length, 'Txns')
    //console.log('[Total ERC]', totalERC, 'ERC-20 Tokens Recieved In', ercTxns.length, 'Txns')
    //console.log('[Total NFTs]', nftsTxns.length, 'NFTs Tokens Recieved In', nftsTxns.length, 'Txns')
    return {
        'ethTxns': ethTxns,
        'totalETH': totalETH,
        'ercTxns': ercTxns,
        'totalERC': totalERC,
        'nftsTxns': nftsTxns,
        'totalNFTs': totalNFTs,

    }
    // console.log(nftsTxns)
    // console.log('Total NFTs', totalNFTs)
}