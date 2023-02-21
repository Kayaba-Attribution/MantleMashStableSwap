<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	import { tweened } from 'svelte/motion';
	import { spotUSD } from '$lib/ethUtils';
	import setup from '$lib/setup.json';

	// onMount(async () => {
	// 	await loginMetamask()
	// })

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});

	import {
		onConnect,
		onDisconnect,
		userBalanceUSD,
		userBalanceNative,
		spotBalanceUpdate,
		blockie
	} from '$lib/web3.ts';
	import {
		connected,
		provider,
		chainId,
		chainData,
		signer,
		signerAddress,
		contracts
	} from 'svelte-ethers-store';
</script>

<div class="navbar fixed bg-base-300 z-40 m-auto h-20 bg-[url('./lib/shine.gif')]">
	<div class="navbar-start">
		<div class="dropdown">
			<label tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</label>
			<ul
				tabindex="0"
				class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li><a href="/">HOME</a></li>
				<li><a href="/app">App</a></li>
				<li><a href="/info">Contracts</a></li>
			</ul>
		</div>
		<a href="/" class="m-2 px-2 normal-case text-xl hidden md:flex">
			<div class="avatar">
				<div class="w-12 rounded">
					<img class="mask mask-squircle" src="./{setup.logo}" alt="Logo" />
				</div>
			</div>
		</a>

		<a
			class="mt-2 md:text-2xl text-lg font-LR font-semibold text-center tracking-tight
	  hover:underline decoration-sky-500/70 md:flex "
			href="/"
			>{setup.title}
			<div class="ml-3 hidden md:flex">{setup.title2}</div></a
		>
	</div>
	<!-- INFO ON THE CENTER OF THE NAVBAR DESKTOP -->
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal p-0 font-extrabold font-LL">
			<li><a href="/">HOME</a></li>
			<li><a href="/app">App</a></li>
			<li><a href="/info">Contracts</a></li>
		</ul>
	</div>
	<div class="navbar-end flex">
		<!-- LOGIN BUTTON -->
		{#if $connected}
			<div on:click={() => onDisconnect()} class="hidden md:flex normal-case btn-ghost btn">
				Disconnect
			</div>
		{/if}
		<div on:click={() => onConnect('main')} class=" normal-case btn-ghost btn">
			{#if !$connected}
				Connect Wallet
			{:else}
				<!-- else content here -->
				<div data-tip={$userBalanceUSD} class="tooltip  hidden md:flex tooltip-bottom">
					<div class="badge mr-2">
						{$userBalanceNative} BIT
					</div>
				</div>
				{$signerAddress.slice(0, 4)}...{$signerAddress.slice(-4)}
			{/if}
		</div>
		<div class="w-10">
			<img src={$blockie} alt="" />
		</div>
		<div
			title="Change Theme"
			class="{setup.enableThemeChange == 'true'
				? 'hidden md:flex'
				: 'hidden'} dropdown dropdown-end"
		>
			<div tabindex="0" class="m-1 normal-case btn-ghost btn">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="inline-block w-6 h-6 stroke-current md:mr-2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
					/>
				</svg>
				<span class="md:inline"> Change Theme </span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1792 1792"
					class="inline-block w-4 h-4 ml-1 fill-current"
				>
					<path
						d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"
					/>
				</svg>
			</div>
			<div
				class="mt-16 overflow-y-auto shadow-2xl top-px dropdown-content h-96 w-52 rounded-b-box bg-base-200 text-base-content"
			>
				<ul class="p-4 menu compact">
					<li><a tabindex="0" data-set-theme="light" data-act-class="active">🌝  light</a></li>
					<li><a tabindex="0" data-set-theme="dark" data-act-class="active">🌚  dark</a></li>
					<li>
						<a tabindex="0" data-set-theme="wireframe" data-act-class="active">📝  Wireframe</a>
					</li>
					<li><a tabindex="0" data-set-theme="retro" data-act-class="active">👴  retro</a></li>
					<li><a tabindex="0" data-set-theme="lofi" data-act-class="active">👓  lofi</a></li>
					<li>
						<a tabindex="0" data-set-theme="bumblebee" data-act-class="active">🐝  bumblebee</a>
					</li>
					<li>
						<a tabindex="0" data-set-theme="valentine" data-act-class="active">🌸  valentine</a>
					</li>
					<li>
						<a tabindex="0" data-set-theme="halloween" data-act-class="active">🎃  halloween</a>
					</li>
					<li><a tabindex="0" data-set-theme="garden" data-act-class="active">🌷  garden</a></li>
					<li><a tabindex="0" data-set-theme="forest" data-act-class="active">🌲  forest</a></li>
					<li><a tabindex="0" data-set-theme="pastel" data-act-class="active">🖍  pastel</a></li>
				</ul>
			</div>
		</div>

		<!-- <div title="Change Lang" class="dropdown dropdown-end">
			<div tabindex="0" class="hidden md:flex btn btn-ghost gap-1 normal-case">
				Languages
				<svg width="12px" height="12px" class="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block"
					xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
					<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
				</svg>
			</div>
			<div
				class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-16 w-32 md:w-64 overflow-y-auto shadow-2xl">
				<ul class="menu menu-compact gap-1 p-3" tabindex="0">
					<li><button class="flex active" on:click={() => {changeLanguage('en')}}><img loading="lazy" width="20" height="20" alt="English"
								src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1ec-1f1e7.svg"> <span
								class="flex flex-1 justify-between ml-3">English </span></button> </li>
					<li><button class="flex" on:click={() => {changeLanguage('ch')}}><img loading="lazy" width="20" height="20" alt="中文"
								src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.0/svg/1f1e8-1f1f3.svg"> <span
								class="flex flex-1 justify-between">Simplified Chinese </span></button> </li>
				</ul>
			</div>
		</div> -->
	</div>
</div>

<style>
	/* Add custom Styles here */
</style>
