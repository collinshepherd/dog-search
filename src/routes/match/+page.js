/** @type {import('./$types').PageLoad} */

export const ssr = false;

export async function load({ fetch, url, request }) {
  try {
    const dogId = url.searchParams.get("dogId");

    const resMatchedDog = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([dogId]),
        credentials: "include",
      }
    );

    if (resMatchedDog.status === 401) {
      throw new Error("Unauthorized");
    }

    const matchedDog = await resMatchedDog.json();

    return {
      auth: true,
      matchedDog,
    };
  } catch (err) {
    console.error(err);
    return {
      auth: false,
    };
  }
}
