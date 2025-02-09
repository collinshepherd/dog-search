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

  let items = breeds.map((breed) => ({
    value: breed,
    label: breed.charAt(0).toUpperCase() + breed.slice(1),
  }));
</script>

{#if auth}
  <SectionWrapper id="search">
    <Header signedIn="true" />
    <div
      class="flex flex-col gap-5 flex-1 items-center justify-center pb-10 md:pb-14"
    >
      <div class="text-3xl font-semibold my-4">Search</div>

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
