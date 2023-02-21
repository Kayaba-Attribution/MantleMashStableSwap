<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	import { afterUpdate } from 'svelte';
	import { onMount } from 'svelte';
    import { init, loadContracts } from "$lib/web3";
    import { signerAddress } from 'svelte-ethers-store';

	onMount(() => {
    	init();
  	})

	let show = false;

	afterUpdate(() => {
		show = true;
	});
</script>

<Header />

<main class="">
	<slot />
</main>


{#if show}
<!-- <div class="flex p-2 footer bg-neutral text-primary-content footer-center justify-center rounded-box">
	<p>Site Build by <a href="https://www.kishield.com/">KISHIELD</a></p>
	<div class="text-2xl font-bold">PadawanDAO
	<div class="font-normal text-sm">
		Helping Young Padawans since 2021
	</div> 
	</div>
	<div>
		<p>PadawanDao Socials</p>
	  <div class="grid grid-flow-col gap-4">
		<a href="https://twitter.com/PadawanDAO"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a> 
	  </div>
	</div>
</div> -->
{/if}

<svelte:head>
  <!-- this is for the web3modal -->
  <script type="text/javascript" src="https://unpkg.com/web3modal@1.9.0/dist/index.js"></script>
  <script type="text/javascript" src="https://unpkg.com/@walletconnect/web3-provider@1.2.1/dist/umd/index.min.js"></script>
  <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

</svelte:head>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
		box-sizing: border-box;
	}
</style>
