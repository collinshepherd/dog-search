<script>
  import { goto } from "$app/navigation";
  import SectionWrapper from "./SectionWrapper.svelte";
  import Header from "./Header.svelte";

  async function signIn(e) {
    e.preventDefault();

    // Check if the form exists and is filled out properly
    const form = e.target;
    if (!form) {
      console.error("Form not found/Incomplete");
      return;
    }

    // Get the values from the form
    const email = form.querySelector("#email")?.value;
    const name = form.querySelector("#name")?.value;

    // Check if name and email are filled
    if (!email || !name) {
      console.error("Email or Name is missing");
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
        throw new Error(`Response Status: ${res.status}`);
      }

      if (res.status === 200) {
        goto("/search");
      }
    } catch (err) {
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
    <form on:submit={(e) => signIn(e)} class="space-y-4 md:space-y-6">
      <div>
        <label for="email" class="block mb-2 font-medium">Your email</label>
        <input
          type="text"
          name="email"
          id="email"
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
          placeholder="Bob"
          class="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
        />
      </div>
      <button type="submit" class="w-full mb-4 outline">Sign In</button>
    </form>
  </div>
</div>
