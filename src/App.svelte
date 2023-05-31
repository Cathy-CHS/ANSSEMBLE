<script>
	export let name;
	// import P5 from 'p5-svelte';
	// import * as P5play from 'p5play';
	import Button from "./Button.svelte";
	import * as Tone from 'tone';
	// const synth = new Tone.Synth().toDestination();
	let points = []; // database
	let timerecord = []; // time record
	const sampler = new Tone.Sampler({
		urls: {
			"C4": "C4.mp3",
			"D#4": "Ds4.mp3",
			"F#4": "Fs4.mp3",
			"A4": "A4.mp3",
		},
		baseUrl: "https://tonejs.github.io/audio/salamander/",
		release: 1,
	}).toDestination();

	// piano({
	// 	parent: document.querySelector("#tiles"),
	// 	noteon: note => sampler.triggerAttack(note.name),
	// 	noteoff: note => sampler.triggerRelease(note.name),
	// });
	Tone.Transport.bpm.value = 60; // define bpm value seperately as constant
	Tone.Transport.start();
</script>

<div id="tiles">

</div>

<Button class="sound"
	on:mousedown={()=>{
		// synth.triggerAttackRelease("C4", "4n");
		// synth.triggerRelease(4n+1);
		// async () => {await Tone.start();};
		Tone.loaded().then(() => {
			sampler.triggerAttack(["C4"]);
			const start = Tone.now();
			timerecord.push(start);
			console.log(`start: ${timerecord}`);
		});
	}}
	on:mouseup={()=>{
		Tone.loaded().then(() => {
			sampler.triggerRelease(["C4"]);
			timerecord.push(Tone.now());
			console.log(`end: ${timerecord}`);
			const point = {
				pitch: "C4",
				bar: 1,
				start: Tone.Time(timerecord[0]).toBarsBeatsSixteenths(),
				duration: Tone.Time(timerecord[1]-timerecord[0]).toNotation(),
				// refer to https://github.com/Tonejs/Tone.js/wiki/Time
			};
			points.push(point);
			console.log(points);
			timerecord = [];
		});
	}}
>C4</Button>

<!-- <P5 {sketch} /> -->