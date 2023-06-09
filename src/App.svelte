<script>
    import { fly, fade, blur, slide, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
    import {width, height} from './Constants.svelte';
	import Layer from "./Layer.svelte";
    import Project from "./Project.svelte";
    
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
                // {
                //     Inst: "cymbal",
                //     points: [{ // Amp: 100이 최대
                //                 amp: 30,
                //                 bar: 1,
                //                 start: 100,
                //                 }, {
                //                 amp: 30,
                //                 bar: 1,
                //                 start: 200,
                //                 }, {
                //                 amp: 50,
                //                 bar: 3,
                //                 start: 7,
                //                 },{
                //                 amp: 20,
                //                 bar: 2,
                //                 start: 120,
                //                 }
                //             ]
                // }
                
			]
	}

	let layers = test_project.Layers;
	let layerToSee = 0;
	let NumBar = test_project.NumBar;
	let toggle= {toggleLayer : true, 
                toggleProject: false};
    function layerToggle(){toggle.toggleLayer = !toggle.toggleLayer}
    function layerDuplicate(){layers.push(JSON.parse(JSON.stringify(layers[layerToSee])))}
    const layerSwitch = event => {
        console.log(event.detail)
        layerToSee=event.detail
  }
</script>

{#if toggle.toggleLayer}
    <div transition:fade>
        <Layer 
        on:layerToProject = {layerToggle}
        on:layerDup={layerDuplicate} 
        {width} {height} {layers} {layerToSee} {NumBar}/>
    </div>
{:else if !(toggle.toggleLayer)}
    <div transition:fade>
        <Project on:layer = {layerToggle}
        on:layernum ={layerSwitch}
         {width} {height} {layers} {layerToSee} {NumBar}/>
    </div>
{/if}

<style>

</style>
