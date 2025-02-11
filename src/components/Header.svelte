<script>
  import { goto } from "$app/navigation";

  // Value to pass through to change what buttons are displayed in the nav
  export let signedIn;

  // function to logout the user on button press
  function buttonHandler() {
    fetch("https://frontend-take-home-service.fetch.com/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    // send the user back to the home page
    goto("/");
  }
</script>

<header class="flex flex-col relative z-20">
  <div
    class="max-w-[1400px] mx-auto w-full flex items-center justify-between p-4 py-6"
    id="header"
  >
    <h1 class="font-semibold text-xl">
      Dog <span class="text-indigo-400">Search</span>
    </h1>

    <!-- Check if the user is not signedIn yet and if they are not then it shows a get started button, if its true then a logout button is showed instead -->
    {#if !signedIn}
      <nav class="hidden md:flex items-center gap-4 lg:gap-6">
        <a href="/login">
          <button aria-label="button to login" class="specialBtn rounded-xl"
            >Get Started</button
          ></a
        >
      </nav>
    {:else}
      <nav class="flex items-center gap-4 lg:gap-6">
        <button
          on:click={() => buttonHandler()}
          aria-label="button to home page"
          class="specialBtn rounded-xl">Log Out</button
        >
      </nav>
    {/if}
  </div>
</header>
