<script>
  import Header from "./Header.svelte";
  import SectionWrapper from "./SectionWrapper.svelte";
</script>

<SectionWrapper>
  <Header />
  <div
    class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14"
  >
    <h2
      class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-[1200px] mx-auto w-full text-center font-semibold"
    >
      <span class="text-indigo-400">Finding</span>
      Your Furry Friend Just Got <span class="text-indigo-400">Easier!</span>
    </h2>
    <p
      class="text-xl sm:text-2xl md:text-3xl text-center maw-w-[1000px] mx-auto w-full"
    >
      Less searching, more finding—your perfect pup is just a click away with
      <span class="italic">personalized matches, details,</span> and more!
    </p>
    <a href="/login">
      <button class="specialBtn">
        <p class="text-base sm:text-lg md:text-xl">Find your perfect pup!</p>
      </button>
    </a>
  </div>
</SectionWrapper>
