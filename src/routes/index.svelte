<script>
	import { OnMount } from 'fractils';
	import Typewriter from 'svelte-typewriter';
	import { reveal } from 'svelte-reveal';
	import { afterUpdate } from 'svelte';

	let show = false;

	afterUpdate(() => {
		show = true;
	});

	import Fa from 'svelte-fa/src/fa.svelte';
	import {
		faLock,
		faArrowRight,
		faArrowLeft,
		faChartLine,
		faShield,
		faCheckCircle,
		faScroll,
		faPenFancy
	} from '@fortawesome/free-solid-svg-icons/index.es';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import setup from '$lib/setup.json';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	// onMount(() => {
	// themeChange(false)
	// // 👆 false parameter is required for svelte
	// })

	import { browser } from '$app/env';
</script>

<svelte:head>
	<title>Mantle Mash StableSwap</title>
</svelte:head>

<div
	class="mt-20 min-h-screen bg-cover bg-center bg-repeat-y"
	style="background-image: url('./gem.jpg');"
>
	{#if show}
		<div class="py-4 px-4 mx-auto max-w-screen-xl text-center lg:px-12">
			<h1
				class="mb-4 mt-8 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
			>
				Mantle Mash StableSwap
			</h1>
			<p
				class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
			>
				Trade stable pairs with a lower slippage based on an invariant curve slippage function, an
				implementation of Curve Finance’s AMM.<br> Created with love for the <a href="https://gitcoin.co/issue/29735" class="underline">Mantle Mash - Gitcoin Hackathon Bounty - DeFi</a>
			</p>
			<div
				class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
			>
				<a
					href="https://github.com/Kayaba-Attribution/MantleMashStableSwap"
					class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
				>
					Learn more
					<svg
						class="ml-2 -mr-1 w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/></svg
					>
				</a>
				<a
					href="https://www.youtube.com/watch?v=QLwesiOFq9k"
					class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
				>
					<svg
						class="mr-2 -ml-1 w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"
						/></svg
					>
					Watch video
				</a>
			</div>
		</div>

		<div class="px-4 mx-auto max-w-screen-xl">
			<div class="max-w-screen-md mb-8 lg:mb-16">
				<h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white" >
					Features And General Information
				</h2>
				<p class="text-gray-500 sm:text-xl dark:text-gray-400">
					To showcase the protocol we create two centralized Stablecoins SMASH & MCASH. PancakeSwap StableSwap contracts were forked, tested, modified and deployed to Mantle Mash Network. Users can claim 1000 SMASH & MCASH tokens per day.
				</p>
			</div>
			<div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
				<div>
					<div
						class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900"
					>
						<svg
							class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/></svg
						>
					</div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">SMASH & MCASH</h3>
					<p class="text-gray-500 dark:text-gray-400">
						StableCoins used to showcase the protocol. Other coins such as bridged USDC, USDT, BUSD, and others can be used to create more swap pools.
					</p>
				</div>
				<div>
					<div
						class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900"
					>
						<svg
							class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
							/></svg
						>
					</div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Low Slippage Trading</h3>
					<p class="text-gray-500 dark:text-gray-400">
						By using Curve Finance’s AMM ideas users can swap large quantities of assets at low prices, this creates an strong foundation for all DeFi protocols.
					</p>
				</div>
				<div>
					<div
						class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900"
					>
						<svg
							class="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							><path
								fill-rule="evenodd"
								d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
								clip-rule="evenodd"
							/><path
								d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"
							/></svg
						>
					</div>
					<h3 class="mb-2 text-xl font-bold dark:text-white">Stable Yield Farming</h3>
					<p class="text-gray-500 dark:text-gray-400">
						The protocol generates revenue via trading fees. At the moment 50% go to LP providers as rewards, and the rest goes to team wallets. This can be expanded to buy-backs and rewards of a native token.
					</p>
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
