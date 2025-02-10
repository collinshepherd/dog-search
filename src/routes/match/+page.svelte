<script>
  import Header from "../../components/Header.svelte";
  import MatchedDogPage from "../../components/MatchedDogPage.svelte";

  export let data;

  const matchedDog = data.matchedDog;
  const auth = data.auth;
</script>

<Header signedIn={"true"} />

{#if auth}
  <MatchedDogPage {matchedDog} />
{:else}
  <div
    class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14"
  >
    <h2
      class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-[1200px] mx-auto w-full text-center font-semibold"
    >
      Please login to access this content.
    </h2>
    <a href="/login">
      <button class="specialBtn rounded-xl">
        <p class="text-base sm:text-lg md:text-xl">Login</p>
      </button>
    </a>
  </div>
{/if}
