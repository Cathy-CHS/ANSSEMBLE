<script>
    import { fly, fade, blur, slide, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
    import {width, height} from './Constants.svelte';
	import Layer from "./layers/Layer.svelte";
    import Project from "./projects/Project.svelte";
    import ProjectSelect from './projects/ProjectSelect.svelte';

    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    import { ref, child, get, set, getDatabase, onValue } from 'firebase/database';
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyD-8EF5xR-SODBJi8XK3Ei13YJiw-X0i1g",
        authDomain: "id311-finalteam5.firebaseapp.com",
        projectId: "id311-finalteam5",
        storageBucket: "id311-finalteam5.appspot.com",
        messagingSenderId: "957534001506",
        appId: "1:957534001506:web:bede6b717496bde6f6b43b",
        measurementId: "G-6GRFL3D471",
        databaseURL: "https://id311-finalteam5-default-rtdb.firebaseio.com/"
    };

    // GLOBALS
    let database=undefined;
    let projToSee = 0
    let project;
    let layers;
    let layerToSee = 1;
    let NumBar;

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    function getData() {
        return new Promise((resolve, reject) => {
            const db = getDatabase();
            const dbRef = ref(db);
            get(dbRef).then((snapshot) => {
                const data = snapshot.val();
                 database = data;
                console.log(database);
                console.log('Database is loaded');
                resolve(data);
            });
        })
    }

    // Start here
    async function main(){
        await getData();
        console.log('start')
    }
    main();

    let user = "Anon";

    // async function loadData() {
    //     database = await getData();
    //     // console.log("db: "+JSON.stringify(data));
    //     console.log("new db: "+JSON.stringify(database));
    //     project = database[projToSee];
    //     layers = project.Layers;
    //     NumBar = project.NumBar;
    // }

    function initProj(projTo){
        projToSee = projTo
        project = database[projToSee]
        console.log(project)
        layers = project.Layers;
        layerToSee = 1;
        NumBar = project.NumBar;
    }
    let toggle= {toggleLayer : false, 
                  toggleProject: false};
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

{#if database}
    {#if !(toggle.toggleProject)}
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
{/if}
<style>

</style>
