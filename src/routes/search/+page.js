/** @type {import('./$types').PageLoad} */

export const ssr = false;

import { totalDogs } from "$lib/store";

export async function load({ fetch, request }) {
  const resDogBreeds = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs/breeds",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  // If the response is not ok, return early with auth false
  if (!resDogBreeds.ok) {
    return {
      post: {
        breeds: [],
        dogs: [],
        auth: null,
      },
    };
  }

  const dogBreeds = await resDogBreeds.json();

  const resDogs = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs/search?size=24&sort=breed:asc",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const resDogsData = await resDogs.json();
  const dogIds = resDogsData.resultIds;

  const res3 = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dogIds),
      credentials: "include",
    }
  );

  const dogs = await res3.json();

  const zipCodes = dogs.map((dog) => dog.zip_code);

  const res4 = await fetch(
    "https://frontend-take-home-service.fetch.com/locations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zipCodes),
      credentials: "include",
    }
  );

  const cities = await res4.json();

  dogs.map((dog, idx) => {
    if (cities[idx]) {
      dog.city = cities[idx].city;
    } else {
      dog.city = dog.zip_code;
    }
  });

  totalDogs.set(resDogsData.total);

  return {
    post: {
      breeds: dogBreeds,
      dogs: dogs,
      auth: true,
      nextDogQuery: resDogsData.next,
    },
  };
}
