<script>
	import { OnMount } from 'fractils';
	import Typewriter from 'svelte-typewriter';
	import { reveal } from 'svelte-reveal';
	import { afterUpdate } from 'svelte';
	import { utils } from 'ethers';

	let show = false;

	afterUpdate(() => {
		show = true;
	});

	function wait(milliseconds) {
		return new Promise((resolve) => setTimeout(resolve, milliseconds));
	}
	onMount(async () => {
		await wait(100);
		//await onConnect('main');
	});

	import {
		// user specific calls
		userBalanceWCRO,
		tokenSupply,
		userBalanceToken,
		userBalanceNative,
		// token
		divBalanceUSDC,
		tokenPrice,
		//divs
		minDistribution,
		userUnpaidEarnings,
		userPaidEarnings,
		totalRewardsDistributed,
		// others
		core,
		onConnect,
		loadContracts
	} from '$lib/web3.ts';

	import { onMount } from 'svelte';

	onMount(async () => {
		await loadContracts();
	});

	function pEther(val) {
		return (val / 10 ** 18).toFixed(2).toLocaleString();
	}

	import Fa from 'svelte-fa/src/fa.svelte';

	import { faArrowsUpDown } from '@fortawesome/free-solid-svg-icons/index.es';

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	const routerAddress = '0x7189e14E5073655b2bd460751eC7393a6E85099c';
	const smashAddress = '0x9Ed8382f7780A7984Aa41C51C8E1AFF969dD7Ede';
	const mcashAddress = '0x4c6Ab66dF1A7A0bda357BE5092404c97ce6eD915';
	const swapAddress = '0xE3E51E157CF89f68973b6d18e81357be7fF2D407';
	import { themeChange } from 'theme-change';
	import setup from '$lib/setup.json';
	import {
		connected,
		provider,
		signer,
		chainId,
		contracts,
		signerAddress
	} from 'svelte-ethers-store';
	let info = {
		SMASH: '0x6Bbab635b376F9880be2EF241c7886940A4d68Ff',
		MCASH: '0xc6CEf33E3D6dA5956E3973fF24725FFb06d51532',
		router: '0x98F9687D62b658aFc0123eCA5668f1dd39B0444c',
		factory: '0x95a81D811Ea00d100c26cb8D77444c9eE8F429B0',
		swapContract: '0xd24348bb374299B3BBc93A4f0D69B8e6f16EA047'
	};
</script>

<svelte:head>
	<title>MM StableSwap info</title>
</svelte:head>

<div
	class="mt-20 min-h-screen bg-cover bg-center bg-repeat-y"
	style="background-image: url('./gem.jpg');"
>
	{#if show}
		<div class="py-4 px-4 mx-auto max-w-screen-xl text-center lg:px-12">
			<h1
				class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
			>
				Mantle Mash StableSwap Info
			</h1>
			<p
				class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
			>
				Here are all the contracts used on the protocol<br />
				Created with love for the
				<a href="https://gitcoin.co/issue/29735" class="underline"
					>Mantle Mash - Gitcoin Hackathon Bounty - DeFi</a
				>
			</p>

			<div class="overflow-x-auto">
				<table class="table w-full">
					<!-- head -->
					<thead>
						<tr>
							<th>Name</th>
							<th>Address</th>
							<th>Link</th>
						</tr>
					</thead>
					<tbody>
						<!-- row 1 -->
						{#each Object.entries(info) as i}
							<tr>
								<th>{i[0]}</th>
								<td>{i[1]}</td>
								<td>
									<a class="underline" href={"https://explorer.testnet.mantle.xyz/address/"+i[1]}>Explorer Link</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<style>
	/* https://codepen.io/studiojvla/pen/qVbQqW */
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-250px * 7));
		}
	}
	.slider {
		box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.125);
		height: 100px;
		margin: auto;
		overflow: hidden;
		position: relative;
	}
	.slider::before,
	.slider::after {
		height: 100px;
		position: absolute;
		width: 200px;
		z-index: 2;
	}
	.slider::after {
		right: 0;
		top: 0;
		transform: rotateZ(180deg);
	}
	.slider::before {
		left: 0;
		top: 0;
	}

	.slide-track {
		animation: scroll 30s linear infinite;
		display: flex;
		width: calc(250px * 13);
	}

	.slider .slide img {
		margin: 0px 0.5em;
		padding: 10px;
		object-fit: contain;
		width: 150px;
		height: 100px;
	}
</style>
