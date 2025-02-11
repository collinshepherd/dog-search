<script>
  import { goto } from "$app/navigation";
  import SectionWrapper from "./SectionWrapper.svelte";
  import Header from "./Header.svelte";

  let email = "";
  let name = "";
  let errorMessage = "";

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function signIn(e) {
    e.preventDefault();
    errorMessage = "";

    // Validate email format
    if (!validateEmail(email)) {
      errorMessage = "Please enter a valid email address.";
      return;
    }

    if (!email || !name) {
      errorMessage = "Email and Name are required.";
      return;
    }

    try {
      const res = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Login failed. Status: ${res.status}`);
      }

      goto("/search");
    } catch (err) {
      errorMessage = "Failed to sign in. Please try again.";
      console.error(err);
    }
  }
</script>

<div
  class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14 bgGradient"
>
  <div
    class="flex flex-col outline-2 outline-solid rounded-xl px-4 bg-white text-black md:px-14"
  >
    <div class="text-3xl p-4">Sign in to your account</div>

    {#if errorMessage}
      <div class="text-red-500 p-2 font-bold">{errorMessage}</div>
    {/if}

    <form on:submit={signIn} class="space-y-4 md:space-y-6">
      <div>
        <label for="email" class="block mb-2 font-medium">Your email</label>
        <input
          type="text"
          name="email"
          id="email"
          bind:value={email}
          placeholder="example@example.com"
          class="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
        />
      </div>
      <div>
        <label for="name" class="block mb-2 font-medium">Your name</label>
        <input
          type="text"
          name="name"
          id="name"
          bind:value={name}
          placeholder="Bob"
          class="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
        />
      </div>
      <button type="submit" class="w-full mb-4 outline rounded-xl">
        Sign In
      </button>
    </form>
  </div>
</div>
