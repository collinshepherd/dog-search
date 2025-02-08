<script>
  import { goto } from "$app/navigation";
  import Header from "./Header.svelte";
  import SectionWrapper from "./SectionWrapper.svelte";
  import { onMount } from "svelte";

  export let breeds;

  export let dogs;

  export let auth;

  console.log("test", auth);
  console.log("test", dogs);

  let canRun = true;
  let currentPage = 1;
  let itemsPerPage = 15;
  let paginatedDogs = [];

  function checkScreenSize() {
    if (!canRun) return;
    canRun = false;

    const windowWidth = window.innerWidth;
    if (windowWidth > 1280) {
      itemsPerPage = 12;
    } else if (windowWidth <= 1280 && windowWidth > 1024) {
      console.log("items per page = 12");
      itemsPerPage = 9;
    } else if (windowWidth < 1024 && windowWidth > 768) {
      console.log("items per page = 8");
      itemsPerPage = 6;
    } else if (windowWidth <= 768) {
      itemsPerPage = 6;
    }
    console.log(itemsPerPage);
    updatePagination();

    setTimeout(() => {
      canRun = true;
    }, 200);
  }

  function updatePagination() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    paginatedDogs = dogs.slice(start, end);
  }

  function nextPage() {
    if (currentPage < Math.ceil(dogs.length / itemsPerPage)) {
      currentPage++;
      updatePagination();
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  }

  import Select from "svelte-select";

  let items = breeds.map((breed) => ({
    value: breed,
    label: breed.charAt(0).toUpperCase() + breed.slice(1),
  }));

  let value = [];
  let checked = [];
  let isChecked = {};

  $: computeValue(checked);
  $: computeIsChecked(checked);

  function computeIsChecked() {
    isChecked = {};
    checked.forEach((c) => (isChecked[c] = true));
  }

  function computeValue() {
    value = checked.map((c) => items.find((i) => i.value === c));
  }

  function handleChange(e) {
    e.preventDefault();
    if (e.type === "clear" && Array.isArray(e.detail)) checked = [];
    else
      checked.includes(e.detail.value)
        ? (checked = checked.filter((i) => i != e.detail.value))
        : (checked = [...checked, e.detail.value]);
  }

  onMount(() => {
    updatePagination();
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
  });
</script>

{#if auth}
  <SectionWrapper id="search">
    <Header signedIn="true" />
    <div
      class="flex flex-col gap-5 flex-1 items-center justify-center pb-10 md:pb-14"
    >
      <div class="text-3xl font-semibold my-4">Search</div>

      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-8"
      >
        <form
          class="grid col-span-2 md:col-span-3 lg:grid lg:row-span-4 lg:col-span-1"
        >
          <div>
            <div class="mb-2">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-grey-900">Name</label
              >
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Banjo"
                class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
            </div>
            <div class="mb-2">
              <label
                for="breed"
                class="block mb-2 text-sm font-medium text-grey-900"
                >Breeds</label
              >
              <select
                id="breed"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
              >
                {#each breeds as breed}
                  <option id={breed}>{breed}</option>
                {/each}
              </select>
            </div>
            <div class="mb-2">
              <label
                for="age"
                class="block mb-2 text-sm font-medium text-grey-900">Age</label
              >
              <select
                id="age"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
              >
                <option value="asc"> Ascending </option>
                <option value="desc"> Descending </option>
              </select>
            </div>
          </div>
        </form>
        {#each paginatedDogs as dog}
          <div
            class="relative w-full h-94 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <a href="/">
              <img
                class="w-full h-64 object-cover"
                src={dog.img}
                alt={dog.name}
              />
            </a>
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
      </div>

      <div class="flex justify-center gap-4">
        <button
          on:click={prevPage}
          class="px-4 py-2 bg-gray-200 rounded-lg"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span class="px-4 py-2"
          >Page {currentPage} of {Math.ceil(dogs.length / itemsPerPage)}</span
        >
        <button
          on:click={nextPage}
          class="px-4 py-2 bg-gray-200 rounded-lg"
          disabled={currentPage >= Math.ceil(dogs.length / itemsPerPage)}
        >
          Next
        </button>
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
      <button class="specialBtn">
        <p class="text-base sm:text-lg md:text-xl">Login</p>
      </button>
    </a>
  </div>
{/if}
