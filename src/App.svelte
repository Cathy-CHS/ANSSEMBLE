<script>
    import { fly, fade, blur, slide, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
    import {width, height} from './Constants.svelte';
	import Layer from "./Layer.svelte";
    import Project from "./Project.svelte";
    import ProjectSelect from './ProjectSelect.svelte';
    // import * as Tone from 'tone';
	// import Piano from "./Piano.svelte";

    // //create a synth and connect it to the main output (your speakers)
    // const synth = new Tone.Synth().toDestination();

    // //play a middle 'C' for the duration of an 8th note
    // synth.triggerAttackRelease("C4", "8n");

    
	const test_project = {
	Maker : "user",
	Title: "Example_projectasdfas",
	Tag : ['example', 'tags', 'P2'],
	Desc : "Example project for implementation, Example project for implementation,Example project for implementation,Example project for implementation",
	// 8 마디
	NumBar : "4",
	NumOrbit : 0,
	Origin : null,
	NumReproduction : 0,
	Layers :[
                {
                    Inst: "piano",
                    points: [{ // 1번째 마디의 5번째 point에서 20/256만큼 진행
                                pitch: 'C4',
                                bar: 1,
                                start: 5,
                                duration: 20
                                }, {
                                pitch: 'E5',
                                bar: 1,
                                start: 5,
                                duration: 100
                                }, {
                                pitch: 'G4',
                                bar: 1,
                                start: 7,
                                duration: 100
                                },{
                                pitch: 'C5',
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
                     Inst: "base",
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
    const test_project2 = JSON.parse(JSON.stringify(test_project))
    test_project2.Layers.splice(2, 1);
    test_project2.Title = "P2"
    const test_project3 = JSON.parse(JSON.stringify(test_project))
    test_project3.Layers.splice(0, 1);
    test_project3.Title = "P3"



    const database = {0:test_project, 1:test_project2, 2:test_project3}

    let project = database[2]
    let user = "Anon"
	let layers = project.Layers;
	let layerToSee = 1;
	let NumBar = project.NumBar;
	let toggle= {toggleLayer : false, 
                toggleProject: false};
    function layerToggle(){toggle.toggleLayer = !toggle.toggleLayer}
    function layerDuplicate(){layers.push(JSON.parse(JSON.stringify(layers[layerToSee])))}
    const layerDelete = event => {
        let toDelete = event.detail
        console.log(toDelete)
        layerToggle()
        layers.splice(toDelete, 1);
        console.log(layers)
     }
    const layerSwitch = event => {layerToSee=event.detail}
    const changeDescs = event => {
        project.Title = event.detail[0]
        project.Desc = event.detail[1]
     }

</script>
{#if !(toggle.toggleProject)}
    <ProjectSelect on:layer = {layerToggle}
    on:projectTexts = {changeDescs}
    on:layernum ={layerSwitch}
    {width} {height} {database} {NumBar}, {user}/>
{:else}
    {#if toggle.toggleLayer}
        <div transition:fade>
            <Layer 
            on:layerToProject = {layerToggle}
            on:layerDup={layerDuplicate} 
            on:deleteLayer={layerDelete}
            {width} {height} {layers} {layerToSee} {NumBar}/>
            <!-- <Piano/> -->
        </div>
    {:else if !(toggle.toggleLayer)}
        <div transition:fade>
            <Project on:layer = {layerToggle}
            on:projectTexts = {changeDescs}
            on:layernum ={layerSwitch}

            {width} {height} {project} {layerToSee} {NumBar}/>
        <!-- <Piano/> -->
        </div>
    {/if}
{/if}





<style>




</style>