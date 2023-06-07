<script>
    import { fly, fade, blur, slide, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
    import {width, height} from './Constants.svelte';
	import Layer from "./Layer.svelte";
    import Project from "./Project.svelte";
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
                    Inst: "piano",
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
                    Inst: "base",
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
                },
                {
                    Inst: "cymbal",
                    points: [{ // Amp: 100이 최대
                                amp: 30,
                                bar: 1,
                                start: 100,
                                }, {
                                amp: 30,
                                bar: 1,
                                start: 200,
                                }, {
                                amp: 50,
                                bar: 3,
                                start: 7,
                                },{
                                amp: 20,
                                bar: 2,
                                start: 120,
                                }
                            ]
                }
                
			]
	}


	let layers = test_project.Layers;
	let layerToSee = 0;
	let NumBar = test_project.NumBar;
	let toggle= {toggleLayer : true, 
                toggleProject: false};
    function layerToggle(){
        toggle.toggleLayer = !toggle.toggleLayer
        console.log(toggle)
    }
</script>

{#if toggle.toggleLayer}
    <div transition:fade>

        <Layer on:layer = {layerToggle} {width} {height} {layers} {layerToSee} {NumBar}/>
        <!-- <Piano/> -->
    </div>
{:else if !(toggle.toggleLayer)}
    <div transition:fade>
        <Project on:layer = {layerToggle} {width} {height} {layers} {layerToSee} {NumBar}/>
    <!-- <Piano/> -->
    </div>
{/if}


<style>

</style>