<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let dogs;

  export let nextDogQuery;
  let prevDogQuery = null;

  let currentPage = 1;
  let itemsPerPage = 15;
  let currentDogs = dogs;

  // Store to keep track of favorite dogs
  let favoriteDogs = writable(new Set());

  // Toggle favorite function
  async function toggleFavorite(dogId) {
    await favoriteDogs.update((favs) => {
      const newFavs = new Set(favs);
      if (newFavs.has(dogId)) {
        newFavs.delete(dogId);
      } else {
        newFavs.add(dogId);
      }
      return newFavs;
    });

    const currentIds = Array.from($favoriteDogs);

    localStorage.setItem("favoriteDogIds", JSON.stringify(currentIds));
  }

  async function loadSavedMatches() {
    const matchedIds = JSON.parse(localStorage.getItem("favoriteDogIds"));
    favoriteDogs.set(new Set(matchedIds));
  }

  async function totalPages() {
    const resTotalDogs = fetch();
  }

  async function nextPage() {
    const resNextDogs = await fetch(
      `https://frontend-take-home-service.fetch.com${nextDogQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const nextDogs = await resNextDogs.json();

    nextDogQuery = nextDogs.next;
    prevDogQuery = nextDogs.prev;

    const dogIds = nextDogs.resultIds;

    const resDogData = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogIds),
        credentials: "include",
      }
    );

    const dogData = await resDogData.json();

    const zipCodes = dogData.map((dog) => dog.zip_code);

    const resCity = await fetch(
      "https://frontend-take-home-service.fetch.com/locations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zipCodes),
        credentials: "include",
      }
    );

    const cities = await resCity.json();

    dogData.map((dog, idx) => {
      if (cities[idx]) {
        dog.city = cities[idx].city;
      } else {
        dog.city = dog.zip_code;
      }
    });

    currentDogs = dogData;
  }

  async function prevPage() {
    if (!prevDogQuery) return;

    const resNextDogs = await fetch(
      `https://frontend-take-home-service.fetch.com${prevDogQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const nextDogs = await resNextDogs.json();

    nextDogQuery = nextDogs.next;
    prevDogQuery = nextDogs.prev;

    const dogIds = nextDogs.resultIds;

    const resDogData = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dogIds),
        credentials: "include",
      }
    );

    const dogData = await resDogData.json();

    const zipCodes = dogData.map((dog) => dog.zip_code);

    const resCity = await fetch(
      "https://frontend-take-home-service.fetch.com/locations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zipCodes),
        credentials: "include",
      }
    );

    const cities = await resCity.json();

    dogData.map((dog, idx) => {
      if (cities[idx]) {
        dog.city = cities[idx].city;
      } else {
        dog.city = dog.zip_code;
      }
    });

    currentDogs = dogData;
  }

  async function generateMatch() {
    const favoriteDogIds = Array.from($favoriteDogs);

    if (favoriteDogIds.length === 0) {
      alert("Please select one dog before trying to match");
      return;
    }

    const resMatch = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favoriteDogIds),
        credentials: "include",
      }
    );

    const matchedDog = await resMatch.json();
  }

  onMount(() => loadSavedMatches());
</script>

{#each currentDogs as dog}
  <div
    class="relative w-full h-94 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
  >
    <!-- Favorite Button -->
    <button
      aria-label="favorite button"
      class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500"
      on:click={() => toggleFavorite(dog.id)}
    >
      {#if $favoriteDogs.has(dog.id)}
        <i class="fa-solid fa-heart text-red-500"></i> <!-- Filled Heart -->
      {:else}
        <i class="fa-regular fa-heart"></i> <!-- Regular Heart -->
      {/if}
    </button>
    <img class="w-full h-64 object-cover" src={dog.img} alt={dog.name} />
    <span class="imgBottomBorder block h-1"></span>
    <div class="grid grid-cols-2 grid-rows-3 text-center w-full">
      <p class="text-xl font-semibold text-indigo-400 col-span-2">
        {dog.name}
      </p>
      <p class="text-md font-semibold text-white">
        {dog.age} years old
      </p>

      <p class="text-md font-semibold text-white">{dog.breed}</p>
      <p class="text-md font-semibold text-white col-span-2">
        {dog.city}
      </p>
    </div>
  </div>
{/each}
<div class="flex justify-center col-span-2 md:col-span-3 lg:col-span-5 gap-4">
  <a href="#header">
    <button
      on:click={prevPage}
      class="px-4 py-2 bg-gray-200 rounded-lg"
      disabled={!prevDogQuery}
    >
      Previous
    </button>
  </a>
  <span class="px-4 py-2"
    >Page {currentPage} of {Math.ceil(10000 / itemsPerPage)}</span
  >
  <a href="#header">
    <button
      on:click={nextPage}
      class="px-4 py-2 bg-gray-200 rounded-lg"
      disabled={currentPage >= Math.ceil(10000 / itemsPerPage)}
    >
      Next
    </button>
  </a>
</div>
<!-- Match Button -->
<button
  class="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600"
  on:click={generateMatch}
>
  Generate Match
</button>
