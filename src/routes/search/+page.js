/** @type {import('./$types').PageLoad} */

export const ssr = false;

export async function load({ fetch, request }) {
  const res = await fetch(
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
  console.log(res.ok);
  if (!res.ok) {
    return {
      post: {
        breeds: [],
        dogs: [],
        auth: null,
      },
    };
  }

  const dogBreeds = await res.json();

  const res2 = await fetch(
    "https://frontend-take-home-service.fetch.com/dogs/search?size=100&sort=breed:asc",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const res2Data = await res2.json();
  const dogIds = res2Data.resultIds;

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

  return {
    post: {
      breeds: dogBreeds,
      dogs: dogs,
      auth: true,
    },
  };
}
