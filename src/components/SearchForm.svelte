<script>
  export let breeds;
</script>

<form class="grid col-span-2 md:col-span-3 lg:row-span-7 lg:col-span-1">
  <div>
    <div class="mb-2">
      <label for="name" class="block mb-2 text-sm font-medium text-grey-900"
        >Name</label
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
      <label for="breed" class="block mb-2 text-sm font-medium text-grey-900"
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
      <label for="age" class="block mb-2 text-sm font-medium text-grey-900"
        >Age</label
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
