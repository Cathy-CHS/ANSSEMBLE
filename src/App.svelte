<script>
	export let name;
	// import P5 from 'p5-svelte';
	// import * as P5play from 'p5play';
	import Button from "./Button.svelte";
	import * as Tone from 'tone';
	// const synth = new Tone.Synth().toDestination();
	const piano = new Tone.Sampler({
		urls: {
			// "C4": "C4.mp3",
			// "Db4": "Db4.mp3",
			// "D4": "D4.mp3",
			// "Eb4": "Eb4.mp3",
			// "E4": "E4.mp3",
			// "F4": "F4.mp3",
			// "Gb4": "Gb4.mp3",
			// "G4": "G4.mp3",
			// "Ab4": "Ab4.mp3",
			// "A4": "A4.mp3",
			// "Bb4": "Bb4.mp3",
			// "B4": "B4.mp3",
			"C4": "C4.mp3",
			"D#4": "Ds4.mp3",
			"F#4": "Fs4.mp3",
			"A4": "A4.mp3",
		},
		// baseUrl: "https://github.com/Cathy-CHS/ID311_FinalProject/tree/Haeseul/assets/piano/",
		baseUrl: "https://tonejs.github.io/audio/salamander/",
		release: 1,
	}).toDestination();
	Tone.Transport.bpm.value = 60; // probably can define seperately as constant
</script>

<Button class="sound" on:click={()=>{
	// synth.triggerAttackRelease("C4", "4n");
	// synth.triggerRelease(4n+1);
	async () => {await Tone.start();}
	Tone.loaded().then(() => {
		piano.triggerAttackRelease(["Eb4", "G4", "Bb4"], "4n");
	});
}}>
	C4
</Button>

<!-- <P5 {sketch} /> -->