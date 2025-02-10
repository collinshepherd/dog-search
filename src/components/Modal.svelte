<script>
  export let open = false;

  const closeModal = () => {
    open = false;
  };
</script>

{#if open}
  <div class="absolute bg-white flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-sm lg:w-xl">
      <slot />
    </div>
  </div>
{/if}
