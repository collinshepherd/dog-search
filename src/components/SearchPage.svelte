<script>
  import { goto } from "$app/navigation";
  import Header from "./Header.svelte";
  import SearchForm from "./SearchForm.svelte";
  import SectionWrapper from "./SectionWrapper.svelte";
  import { onMount } from "svelte";
  import DogCards from "./DogCards.svelte";

  export let breeds;

  export let dogs;

  export let auth;

  export let nextDogQuery;
</script>

<!-- Auth is passed from an earlier query where if the query is successful then auth is true -->
<!-- If auth is true we render the search page but if it is false we direct the user to login so they can have a new cookie for the API -->
{#if auth}
  <SectionWrapper id="search">
    <Header signedIn="true" />
    <div
      class="flex flex-col gap-5 flex-1 items-center justify-center pb-10 md:pb-14"
    >
      <h1 class="text-4xl font-bold my-4 text-indigo-400">Search</h1>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-8">
        <SearchForm {breeds} />
        <DogCards {dogs} {nextDogQuery} />
      </div>
    </div>
  </SectionWrapper>
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
