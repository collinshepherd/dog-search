<script>
  // data passed through for the matchedDog
  export let matchedDog;

  import SectionWrapper from "./SectionWrapper.svelte";

  const matchedDogData = matchedDog[0];
</script>

<SectionWrapper id="match">
  <h2
    class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-[1200px] mx-auto w-full text-center font-semibold mt-10"
  >
    You Found Your <span class="text-indigo-400">Match!</span>
  </h2>
  <div class="flex justify-center">
    <div
      class="relative w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mt-2 lg:w-3/4"
    >
      <img
        class="w-full h-96 md:h-128 lg:h-164 object-cover"
        src={matchedDogData.img}
        alt={matchedDogData.name}
      />
      <span class="imgBottomBorder block h-1"></span>
      <div class="grid grid-cols-2 grid-rows-3 text-center w-full">
        <p class="text-xl font-semibold text-indigo-400 col-span-2">
          {matchedDogData.name}
        </p>
        <p class="text-md font-semibold text-white">
          {matchedDogData.age} years old
        </p>

        <p class="text-md font-semibold text-white truncate pr-1">
          {matchedDogData.breed}
        </p>
        <p class="text-md font-semibold text-white col-span-2">
          Zip Code: {matchedDogData.zip_code}
        </p>
      </div>
    </div>
  </div>

  <div class="flex justify-center mt-4 text-xl">
    <a href="/search">
      <button aria-label="button to search page" class="specialBtn rounded-xl"
        >Go back to search</button
      ></a
    >
  </div>
</SectionWrapper>
