<script>
  let { children } = $props();
  import "../app.css";
  import Footer from "../components/Footer.svelte";
</script>

{@render children()}

<Footer />
