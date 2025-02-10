import { writable } from "svelte/store";

export const formData = writable({
  breeds: [],
  sort: "breed:asc",
  ageMin: "",
  ageMax: "",
  size: 24,
});

export let totalDogs = writable(0);

export let favoriteDogs = writable(new Set());
