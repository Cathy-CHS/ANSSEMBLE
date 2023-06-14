<script>
    import { fly, fade, blur, slide, scale } from 'svelte/transition';
	  import { onMount } from 'svelte';
    import {width, height} from './Constants.svelte';
	  import Layer from "./Layer.svelte";
    import Project from "./Project.svelte";
    import ProjectSelect from './ProjectSelect.svelte';
    
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
                      Inst: "cymbal",
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

    let user = "Anon"
    const database = {0:test_project, 1:test_project2, 2:test_project3}
    let projToSee = 0
    let project = database[projToSee]
    let layers = project.Layers;
    let layerToSee = 1;
    let NumBar = project.NumBar;

    function initProj(projTo){
        projToSee = projTo
        project = database[projToSee]
        console.log(project)
        layers = project.Layers;
        layerToSee = 1;
        NumBar = project.NumBar;
    }
    let toggle= {toggleLayer : true, 
                  toggleProject: true};
    let dupProjectToggle = false
    function layerToggle(){
        dupProjectToggle = false
        toggle.toggleLayer = !toggle.toggleLayer}
    function projToggle(){
        dupProjectToggle = false
        toggle.toggleProject = !toggle.toggleProject}
    function layerDuplicate(){layers.push(JSON.parse(JSON.stringify(layers[layerToSee])))}
    const layerDelete = event => {
        let toDelete = event.detail
        layerToggle()
        layers.splice(toDelete, 1);
     }
    const layerSwitch = event => {layerToSee=event.detail}
    const projSwitch = event => {
        projToSee=event.detail
        initProj(projToSee)
    }
    const changeDescs = event => {
        project.Title = event.detail[0]
        project.Desc = event.detail[1]
    }

    function dupProjectInside(){
      let index = Object.keys(database).length
      database[index] = JSON.parse(JSON.stringify(database[projToSee]))
      database[index].Title +="-Copy" 
      initProj(index)
      dupProjectToggle = true
    }
</script>

{#if !(toggle.toggleProject)}
    <script>console.log('asdfasdf')</script>    
    <ProjectSelect on:project = {projToggle}
    on:projectnum ={projSwitch}
    {width} {height} {database} {projToSee} {NumBar}, {user}/>
{:else if toggle.toggleLayer}
    <div transition:fade>
        <Layer 
        on:layerToProject = {layerToggle}
        on:layerDup={layerDuplicate} 
        on:deleteLayer={layerDelete}
        {width} {height} {layers} {layerToSee} {NumBar}/>
    </div>
{:else if dupProjectToggle}
    <div transition:fade>
        <Project on:layer = {layerToggle}
        on:projToTot = {projToggle}
        on:projectTexts = {changeDescs}
        on:layernum ={layerSwitch}
        on:projDup = {dupProjectInside}
        {width} {height} {project} {layerToSee} {NumBar}/>
    </div>
{:else if !(toggle.toggleLayer)}
    <div transition:fade>
        <Project on:layer = {layerToggle}
        on:projToTot = {projToggle}
        on:projectTexts = {changeDescs}
        on:layernum ={layerSwitch}
        on:projDup = {dupProjectInside}
        {width} {height} {project} {layerToSee} {NumBar}/>
    </div>
{/if}

<style>

</style>
