<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import { totalDogs } from "../lib/store";

  let totalPages = Math.ceil($totalDogs / 24);

  export let dogs;

  export let nextDogQuery;

  let prevDogQuery = null;

  let currentPage = 1;
  let currentDogs = dogs;

  // Importing formData from a store file so Dog Cards can update
  import { formData } from "../lib/store";

  // Store to keep track of favorite dogs
  import { favoriteDogs } from "../lib/store";

  // Toggle favorite function
  async function toggleFavorite(dogId) {
    favoriteDogs.update((favs) => {
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

  // Function to get all of the stored favorite dogs from localstorage
  async function loadSavedMatches() {
    const matchedIds = JSON.parse(localStorage.getItem("favoriteDogIds"));
    favoriteDogs.set(new Set(matchedIds));
  }

  // Function to get the next dog query and move on in the pagination
  async function nextPage() {
    currentPage++;

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

    // Adding the city to the dogData array so that they can display the city instead of the zip code
    dogData.map((dog, idx) => {
      if (cities[idx]) {
        dog.city = cities[idx].city;
      } else {
        // If the api did not get a valid city just make it the zip code again
        dog.city = dog.zip_code;
      }
    });

    currentDogs = dogData;
  }

  // Function to call the prev Query if it is possible and available and move the pagination
  async function prevPage() {
    if (!prevDogQuery || currentPage === 1) return;

    currentPage--;

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

  async function newSearchFilter(formData) {
    const baseUrl = "https://frontend-take-home-service.fetch.com/dogs/search?";
    let params = "";

    for (const key in formData) {
      if (formData[key]) {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((breed) => {
            params += `${key}=${breed}&`;
          });
        } else {
          params += `${key}=${formData[key]}&`;
        }
      }
    }

    const searchURL = `${baseUrl}${params.toString()}`;

    const resDogs = await fetch(searchURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const dogData = await resDogs.json();

    const dogIds = dogData.resultIds;

    const resNewDogs = await fetch(
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

    const newDogs = await resNewDogs.json();

    const zipCodes = newDogs.map((dog) => dog.zip_code);

    const res4 = await fetch(
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

    const cities = await res4.json();

    // Adding the city to the newDogs array so that they can display the city instead of the zip code
    newDogs.map((dog, idx) => {
      if (cities[idx]) {
        dog.city = cities[idx].city;
      } else {
        dog.city = dog.zip_code;
      }
    });

    currentDogs = newDogs;

    totalDogs.set(dogData.total);

    totalPages = Math.ceil($totalDogs / 24);

    nextDogQuery = dogData.next;
  }
  $: {
    // When the formData changes it updates the searchFilter and calls a new Query to update
    if ($formData) {
      newSearchFilter($formData);

      currentPage = 1;
    }
  }

  $: {
    // If the localStorage changes in any way it loads the matches Ex.) when the local storage is cleared
    if ($favoriteDogs) {
      loadSavedMatches();
    }
  }

  onMount(() => loadSavedMatches());
</script>

<!-- Loop through each dog and make a card to display -->
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

      <p class="text-md font-semibold text-white truncate pr-1">{dog.breed}</p>
      <p class="text-md font-semibold text-white col-span-2">
        {dog.city}
      </p>
    </div>
  </div>
{/each}
<!-- Buttons for next and prev page -->
<div class="flex justify-center col-span-2 md:col-span-3 lg:col-span-5 gap-4">
  <a href="#header">
    <button
      on:click={prevPage}
      class="px-4 py-2 bg-gray-200 rounded-lg"
      disabled={currentPage === 1}
    >
      Previous
    </button>
  </a>
  <span class="px-4 py-2">Page {currentPage} of {totalPages}</span>

  <a href="#header">
    <button
      on:click={nextPage}
      class="px-4 py-2 bg-gray-200 rounded-lg"
      disabled={currentPage >= totalPages}
    >
      Next
    </button>
  </a>
</div>
