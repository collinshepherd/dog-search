<script>
  /** @type {import('./$types').PageProps} */
  let { data } = $props();
  import SearchPage from "../../components/SearchPage.svelte";
</script>

<SearchPage
  breeds={data.post.breeds}
  dogs={data.post.dogs}
  auth={data.post.auth}
  nextDogQuery={data.post.nextDogQuery}
  totalPages={data.post.totalPages}
/>
