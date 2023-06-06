<script>
    import { fly, fade, blur, slide, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Layer from "./Layer.svelte";
    // import * as Tone from 'tone';
	// import Piano from "./Piano.svelte";

    // //create a synth and connect it to the main output (your speakers)
    // const synth = new Tone.Synth().toDestination();

    // //play a middle 'C' for the duration of an 8th note
    // synth.triggerAttackRelease("C4", "8n");

	const test_project = {
	Maker : "user",
	Title: "Example_project",
	Tag : ['example', 'tags', 'P2'],
	Desc : "Example project for implementation",
	// 8 마디
	NumBar : "6",
	NumOrbit : 0,
	Origin : null,
	NumReproduction : 0,
	Layers :[
                {
                    Inst: "Piano",
                    points: [{ // 1번째 마디의 5번째 point에서 20/256만큼 진행
                                pitch: 'C8',
                                bar: 1,
                                start: 5,
                                duration: 20
                                }, {
                                pitch: 'E8',
                                bar: 1,
                                start: 5,
                                duration: 100
                                }, {
                                pitch: 'G8',
                                bar: 1,
                                start: 7,
                                duration: 100
                                },{
                                pitch: 'C8',
                                bar: 2,
                                start: 120,
                                duration: 30
                                }
                            ]
                }, 
                {
                    Inst: "Base",
                    points: [{ // Amp: 100이 최대
                                amp: 100,
                                bar: 1,
                                start: 5,
                                }, {
                                amp: 50,
                                bar: 1,
                                start: 5,
                                }, {
                                amp: 30,
                                bar: 1,
                                start: 7,
                                },{
                                amp: 70,
                                bar: 2,
                                start: 120,
                                }
                            ]
                }
			]
	}

	let width = window.innerWidth;
    let height = window.innerWidth/1920*1080;
	let layers = test_project.Layers;
	let layerToSee =0;
	let NumBar = test_project.NumBar;
	
</script>



<div transition:fade>
	
	<Layer {width} {height} {layers} {layerToSee} {NumBar}/>
	<!-- <Piano/> -->
</div>



<style>

</style>