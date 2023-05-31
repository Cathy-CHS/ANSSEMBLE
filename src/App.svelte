<script>
	export let name;
	// import P5 from 'p5-svelte';
	// import * as P5play from 'p5play';
	import Button from "./Button.svelte";
	import * as Tone from 'tone';
	// const synth = new Tone.Synth().toDestination();
	const piano = new Tone.Sampler({
		urls: {
			"C4": "./assets/piano/C4.mp3",
			"Db4": "./assets/piano/Db4.mp3",
			"D4": "./assets/piano/D4.mp3",
			"Eb4": "./assets/piano/Eb4.mp3",
			"E4": "./assets/piano/E4.mp3",
			"F4": "./assets/piano/F4.mp3",
			"Gb4": "./assets/piano/Gb4.mp3",
			"G4": "./assets/piano/G4.mp3",
			"Ab4": "./assets/piano/Ab4.mp3",
			"A4": "./assets/piano/A4.mp3",
			"Bb4": "./assets/piano/Bb4.mp3",
			"B4": "./assets/piano/B4.mp3",
		},
		baseUrl: "https://github.com/fuhton/piano-mp3/tree/master/piano-mp3",
		release: 1,
	}).toDestination();
	Tone.Transport.bpm.value = 60; // probably can define seperately as constant
</script>

<Button class="sound" on:click={()=>{
	// synth.triggerAttackRelease("C4", "4n");
	// synth.triggerRelease(4n+1);
	Tone.loaded().then(() => {
		piano.triggerAttackRelease(["Eb4", "G4", "Bb4"], "4n");
	});
}}>
	C4
</Button>

<!-- <P5 {sketch} /> -->