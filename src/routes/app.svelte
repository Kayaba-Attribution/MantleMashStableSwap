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

	const routerAddress = '0x98F9687D62b658aFc0123eCA5668f1dd39B0444c';
	const smashAddress = '0x6Bbab635b376F9880be2EF241c7886940A4d68Ff';
	const mcashAddress = '0xc6CEf33E3D6dA5956E3973fF24725FFb06d51532';
	const swapAddress = '0xd24348bb374299B3BBc93A4f0D69B8e6f16EA047';
	import { themeChange } from 'theme-change';
	import setup from '$lib/setup.json';
	const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
	import {
		connected,
		provider,
		signer,
		chainId,
		contracts,
		signerAddress
	} from 'svelte-ethers-store';
	let swapAmountA;
	$: swapResult = (swapAmountA * coinA.mul).toFixed(4);

	let coinA = {
		name: 'SMASH',
		addrs: smashAddress,
		mul: 0.9991
	};
	let coinB = {
		name: 'MCASH',
		addrs: mcashAddress,
		mul: 0.9997
	};

	function swapCoins() {
		let oldA = coinA;
		let oldb = coinB;
		coinA = oldb;
		coinB = oldA;
	}
</script>

<svelte:head>
	<title>MM StableSwap App</title>
</svelte:head>

<div
	class="mt-20 min-h-screen bg-cover bg-center bg-repeat-y"
	style="background-image: url('./gem.jpg');"
>
	{#if show}
		{#if $chainId != 5001}
			{#if !$connected}
				<!-- content here -->
				<div class="alert alert-error shadow-lg">
					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<span class="ml-3">Error! Please Connect to Mantle Mash Testnet network</span>
					</div>
				</div>
			{:else}
				<div class="alert alert-error shadow-lg">
					<div class="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<span class="ml-3">Error! Please Switch to Stable Mash Testnet network</span>
					</div>
				</div>
			{/if}
		{/if}
		<div class="py-4 px-4 mx-auto max-w-screen-xl text-center lg:px-12">
			<h1
				class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
			>
				Mantle Swap StableSwap App
			</h1>
			<p
				class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
			>
				To start claim SMASH and/or MCASH tokens, approve the router and start swapping!<br />
				Created with love for the
				<a href="https://gitcoin.co/issue/29735" class="underline"
					>Mantle Mash - Gitcoin Hackathon Bounty - DeFi</a
				>
			</p>

			<div class="grid md:grid-rows-2 md:grid-flow-col gap-4 ">
				<div
					class="md:row-span-2 md:col-span-2  text-left object-contain items-center p-2 rounded-[2rem] border-gradient-br-blue-green-gray-900 hover:border-gradient-tl-blue-green-gray-900 gradient-border-2"
				>
					<div class="flex justify-center">
						<p class="mt-5 text-md font-bold md:text-2xl font-LL text-center">Your balances</p>
					</div>

					<div class="divider mx-4" />
					<div class="flex justify-start items-center font-LL px-4 space-x-4">
						<div class="btn btn-info btn-outline" on:click={() => $contracts.SMASH.drip()}>
							Claim
						</div>
						<div class="">SMASH:</div>
						<div class="stat-value">
							{#await $contracts.SMASH.balanceOf($signerAddress)}
								<span>...</span>
							{:then value}
								<span>{numberWithCommas(pEther(value))}</span>
							{/await}
						</div>
						<div class="stat-desc">SMASH</div>
					</div>
					<div class="divider mx-4" />

					<div class="flex justify-start items-center font-LL px-4 space-x-4">
						<div class="btn btn-info btn-outline" on:click={() => $contracts.MCASH.drip()}>
							Claim
						</div>
						<div class="">MCASH:</div>
						<div class="stat-value">
							{#await $contracts.MCASH.balanceOf($signerAddress)}
								<span>...</span>
							{:then value}
								<span>{numberWithCommas(pEther(value))}</span>
							{/await}
						</div>
						<div class="stat-desc">MCASH</div>
					</div>
					<div class="divider mx-4" />
					<div class="flex justify-start items-center  px-4 space-x-4">
						<div class="flex items-center text-center">SMASH / MCASH <br /> pair reserves:</div>
						<div class="stat-value">
							{#await $contracts.MCASH.balanceOf(swapAddress)}
								<span>...</span>
							{:then value}
								<span>{numberWithCommas(pEther(value))}</span>
							{/await}
						</div>
						<div class="stat-desc">SMASH</div>
						<div class="stat-value">
							{#await $contracts.SMASH.balanceOf(swapAddress)}
								<span>...</span>
							{:then value}
								<span>{numberWithCommas(pEther(value))}</span>
							{/await}
						</div>
						<div class="stat-desc">SMASH</div>
					</div>
				</div>
				<div
					class="md:col-span-2  text-center items-center p-2 rounded-[2rem] border-gradient-br-blue-green-gray-900 hover:border-gradient-tl-blue-green-gray-900 gradient-border-2"
				>
					<div class="flex justify-center">
						<p class="mt-5 text-md font-bold md:text-2xl font-LL text-center">Router Allowances</p>
					</div>
					<div class="divider mx-4" />

					<div class="flex justify-start items-center font-LL px-4 space-x-4">
						{#await $contracts.MCASH.allowance($signerAddress, routerAddress)}
							<span>...</span>
						{:then value}
							<span>{pEther(value)}</span>
							{#if value < 1000000 * 10 ** 18}
								<!-- content here -->
								<div class="flex items-center gap-4">
									<div>Router Allowance</div>
									<input type="checkbox" class="checkbox" disabled />
								</div>
								<button
									on:click={() => $contracts.MCASH.approve(routerAddress, MAX_INT)}
									class="btn btn-outline btn-info">Approve</button
								>
							{:else}
								<div class="flex items-center gap-4">
									<div>MCASH Router Allowance</div>
									<input type="checkbox" class="checkbox" disabled checked />
								</div>
								<!-- else content here -->
							{/if}
						{/await}
					</div>
					<div class="divider mx-4" />

					<div class="flex justify-start items-center font-LL px-4 space-x-4">
						{#await $contracts.SMASH.allowance($signerAddress, routerAddress)}
							<span>...</span>
						{:then value}
							<span>{pEther(value)}</span>
							{#if value < 1000000 * 10 ** 18}
								<!-- content here -->
								<div class="flex items-center gap-4">
									<div>Router Allowance</div>
									<input type="checkbox" class="checkbox" disabled />
								</div>
								<button
									on:click={() => $contracts.SMASH.approve(routerAddress, MAX_INT)}
									class="btn btn-outline btn-info">Approve</button
								>
							{:else}
								<div class="flex items-center gap-4">
									<div>SMASH Router Allowance</div>
									<input type="checkbox" class="checkbox" disabled checked />
								</div>
								<!-- else content here -->
							{/if}
						{/await}
					</div>
					<div class="divider mx-4" />
				</div>
				<div
					class="md:row-span-3   text-center items-center p-2 rounded-[2rem] border-gradient-br-blue-green-gray-900 hover:border-gradient-tl-blue-green-gray-900 gradient-border-2"
				>
					<div class="flex justify-center">
						<p class="mt-5 text-md font-bold md:text-2xl font-LL text-center">Swap</p>
					</div>
					<div class="max-w-screen-lg mx-auto flex mt-2">
						<img class="mx-auto w-32 mask mask-circle" src="./mantlenetworkio.png" alt="screenshot" />
					</div>
					<div class="divider mx-4" />

					<div class="flex justify-center items-center font-LL px-4 space-x-4">
						<div class="form-control w-full max-w-xs">
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="label">
								<span class="label-text">{coinA.name}</span>
								<span class="label-text-alt">
									<div class="badge badge-outline">
										{coinA.addrs.slice(0, 4)}...{coinA.addrs.slice(-4)}
									</div>
								</span>
							</label>
							<input
								bind:value={swapAmountA}
								type="number"
								placeholder="0.0"
								class="input input-bordered w-full max-w-xs"
							/>
						</div>
					</div>
					<button class="btn btn-circle btn-outline mt-6 " on:click={swapCoins}>
						<Fa size="2x" icon={faArrowsUpDown} class="" />
					</button>
					<div class="flex justify-center items-center font-LL px-4 space-x-4 pb-4">
						<div class="form-control w-full max-w-xs">
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label class="label">
								<span class="label-text">{coinB.name}</span>
								<span class="label-text-alt">
									<div class="badge badge-outline">
										{coinB.addrs.slice(0, 4)}...{coinB.addrs.slice(-4)}
									</div>
								</span>
							</label>
							<input
								bind:value={swapResult}
								type="number"
								placeholder="0.0"
								class="input input-bordered w-full max-w-xs"
								disabled
							/>
						</div>
					</div>
					<div class="badge badge-outline">Slippage: > {swapAmountA > 0 ? '0.1' : '0 '}%</div>
					<br />
					<div class="badge badge-outline">
						Min Received: ~{swapAmountA > 0 ? swapAmountA - swapAmountA * 0.0028 : '0 '}
					</div>
					<div class="flex justify-center items-center font-LL px-4 space-x-4 py-4">
						<button
							on:click={() =>
								$contracts.ROUTER.swap(
									coinA.addrs,
									coinB.addrs,
									utils.parseEther(swapAmountA.toString()),
									0,
									0
								)}
							class="btn btn-wide btn-info btn-outline">Swap {coinA.name} -> {coinB.name}</button
						>
					</div>
				</div>
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
