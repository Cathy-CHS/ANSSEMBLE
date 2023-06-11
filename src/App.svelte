<script>
  import P5 from 'p5-svelte';
  import * as Tone from 'tone';
  import Piano from "./Piano.svelte";
  import Guitar from "./Guitar.svelte";
  import Main from "./mainscreen.svelte";

  const sketch = (p5) => {
    // your sketch logic here
  };

</script>

<P5 {sketch} />

<Main />