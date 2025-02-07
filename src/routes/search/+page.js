// /** @type {import('./$types').PageLoad} */

// export async function load({ params }) {
//   const res = await fetch(
//     "https://frontend-take-home-service.fetch.com/dogs/breeds",
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     }
//   );

//   const dogBreeds = await res.json();
//   console.log(dogBreeds);

//   return {
//     post: {
//       breeds: dogBreeds,
//     },
//   };
// }
