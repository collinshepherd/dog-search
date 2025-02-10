<script>
  import Select from "svelte-select";

  export let breeds;

  import { favoriteDogs, formData } from "../lib/store";

  import Modal from "./Modal.svelte";
  import { goto } from "$app/navigation";

  let showModal = false;

  let selectedBreeds = [];

  let breedsValue = "";
  let name = "";
  let sort = "";
  let ageMin = "";
  let ageMax = "";

  let currentFormData = {
    breeds: [],
    sort: "breed:asc",
    ageMin: "",
    ageMax: "",
    size: 24,
  };

  let searchQuery = "";
  let filteredBreeds = breeds;

  // Filtering breeds based on search input
  function filterBreeds() {
    filteredBreeds = breeds.filter((breed) =>
      breed.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Mapping age categories to ageMin and ageMax
  const ageRanges = {
    all: { ageMin: 0, ageMax: 35 },
    puppy: { ageMin: 0, ageMax: 1 },
    young: { ageMin: 1, ageMax: 2 },
    adult: { ageMin: 2, ageMax: 7 },
    senior: { ageMin: 8, ageMax: 35 },
  };

  // Handle changes in the age select
  function handleAgeChange(event) {
    const selectedAge = event.target.value;
    const range = ageRanges[selectedAge];

    if (range) {
      formData.update(() => ({
        ...currentFormData,
        ageMin: range.ageMin,
        ageMax: range.ageMax,
      }));
    }
  }

  function handleBreedChange(event, breed) {
    // Check if breed is checked or unchecked
    if (event.target.checked) {
      // Add breed to selectedBreeds if checked
      selectedBreeds = [...selectedBreeds, breed];
    } else {
      // Remove breed from selectedBreeds if unchecked
      selectedBreeds = selectedBreeds.filter(
        (selectedBreed) => selectedBreed !== breed
      );
    }

    formData.update(() => ({
      ...currentFormData,
      breeds: selectedBreeds,
    }));
  }

  $: {
    // When formData updates I set currentFormData because sometimes $formData does not pull its data accurately
    if ($formData) {
      currentFormData = $formData;
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    formData.set(ageMin, ageMax);
  }

  async function generateMatch() {
    const favoriteDogIds = await JSON.parse(
      localStorage.getItem("favoriteDogIds")
    );

    if (!favoriteDogIds || favoriteDogIds.length === 0) {
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

    goto(`/match?dogId=${matchedDog.match}`);
  }

  async function clearFavorites() {
    localStorage.removeItem("favoriteDogIds");
    favoriteDogs.set(new Set());
  }

  async function clearSelectedBreeds() {
    selectedBreeds = [];

    // Ensure the store updates with default values if it's undefined
    formData.update((data) => ({
      ...currentFormData,
      breeds: selectedBreeds,
    }));
  }
</script>

<!-- Checking if the user clicks outside the modal and closes it if they are -->
<svelte:window
  on:click={(event) => {
    if (!event.target.classList.contains("insideModal")) {
      showModal = false;
    }
  }}
/>

<form
  on:submit={handleSubmit}
  class="grid col-span-2 md:col-span-3 lg:row-span-7 lg:col-span-1 z-999"
>
  <div>
    <div class="mb-2">
      <button
        on:click={(event) => {
          event.stopPropagation();
          showModal = !showModal;
        }}
        class="w-full mt-4 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600"
      >
        Select Breeds
      </button>

      <Modal bind:open={showModal} class="insideModal">
        <div class="p-4">
          <!-- Search Input -->
          <input
            type="text"
            bind:value={searchQuery}
            on:input={filterBreeds}
            placeholder="Search breeds..."
            class="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none insideModal"
          />
          <ul
            class="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2 insideModal"
          >
            {#each filteredBreeds as breed}
              <li
                class="p-1 text-lg flex justify-between items-center insideModal"
                key={breed}
                value={breed}
              >
                {breed}
                <input
                  type="checkbox"
                  value={breed}
                  on:change={(event) => handleBreedChange(event, breed)}
                  class="w-5 h-5 insideModal"
                  checked={selectedBreeds.includes(breed)}
                />
              </li>
            {/each}
          </ul>
        </div>
        <div class="flex justify-between">
          <button
            on:click={() => clearSelectedBreeds()}
            class="mt-4 bg-red-500 text-white px-4 py-2 rounded insideModal"
            >Clear Selected</button
          >
          <button
            on:click={() => (showModal = false)}
            class="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>

    <!-- <div class="mb-2">
      <label for="sort" class="block mb-2 text-sm font-medium text-grey-900"
        >Sort Order</label
      >
      <select
        id="sort"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
      >
        <option value="asc"> Ascending </option>
        <option value="desc"> Descending </option>
      </select>
    </div> -->
    <div class="mb-2">
      <label for="age" class="block mb-2 text-sm font-medium text-grey-900"
        >Age</label
      >
      <select
        on:change={handleAgeChange}
        id="age"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
      >
        <option value="all">All Ages</option>
        <option value="puppy"> Puppy </option>
        <option value="young"> Young </option>
        <option value="adult"> Adult </option>
        <option value="senior"> Senior </option>
      </select>
    </div>
    <div class="w-full">
      <button
        class="w-full mt-4 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600"
        on:click={generateMatch}
      >
        Generate Match
      </button>
    </div>
    <div class="w-full">
      <button
        class="w-full mt-4 bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600"
        on:click={clearFavorites}
      >
        Clear Favorites
      </button>
    </div>
  </div>
</form>
<!-- Match Button -->
