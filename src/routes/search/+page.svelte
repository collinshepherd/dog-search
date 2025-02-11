<script>
  /** @type {import('./$types').PageProps} */
  let { data } = $props();
  import SearchPage from "../../components/SearchPage.svelte";
</script>

<!-- If the user is not logged in then it will redirect the user to login -->
{#if data.post.auth}
  <!-- Passing through all pre load data to the SearchPage -->
  <SearchPage
    breeds={data.post.breeds}
    dogs={data.post.dogs}
    auth={data.post.auth}
    nextDogQuery={data.post.nextDogQuery}
    totalPages={data.post.totalPages}
  />
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
