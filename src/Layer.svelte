<script>
    import { onMount } from 'svelte';
    // import * as Tone from 'tone';
    import { setupPiano, drawPiano, playPiano } from './Piano.svelte';
    
    export let [width, height, layer, layers, NumBar] = [400, 300, {}, []];
    console.log(width, height, layer, NumBar);
    const colors ={
        back: '#030309',
        default: '#f5fafa',
        blue: '#9395f1',
        green: '#99e4d3',
        purple: '#bd9af0',
        pink: '#f293c7',
        yellow: '#fade96'
    }
    //max number of bar in one display
    const numBarShow = 3;
    const startingPoint = width/3 
    const layerWidth = width-startingPoint;
    const lineWidth = height/700;
    const duraWidth = height/15;
    let BPM = 60;

    // create a synth and connect it to the main output (your speakers)
    // const synth = new Tone.Synth().toDestination();
    // console.log(synth);

    // // play a middle 'C' for the duration of an 8th note
    // synth.triggerAttackRelease("C4", "8n");

    // const sampler = new Tone.Sampler({
	// 	urls: {
	// 		"C4": "C4.mp3",
	// 		"D#4": "Ds4.mp3",
	// 		"F#4": "Fs4.mp3",
	// 		"A4": "A4.mp3",
	// 	},
	// 	baseUrl: "https://tonejs.github.io/audio/salamander/",
	// 	release: 1,
	// }).toDestination();

    // Tone.Transport.bpm.value = BPM;
	// Tone.Transport.start();
    // sampler.start();
    
    let key;
    let press;

    let absoluteTick = 0;
    const sketch = (p5) =>{
        // If true, time cursor will move
        let cursorMode = true;
        //showLocation: location of displayed starting point, previous bar*256 + location in bar -1
        let showLocation = 0;
        //pointer: location of time cursor (also a tick)
        let pointer = 0;
        const mainLayerHeight = height/4.5;

        //4/4 => 60/(BPM/4)s = 1 bar time. 1 bar = 256 tick
        // 1 bar time / 256 = 1 tick time
        // inverse of 1 tick time = fr
        let frameRate = 1/(60/(BPM/4)/256)
        console.log(frameRate);

        //let sprite_test
        p5.setup = async ()=>{
            p5.createCanvas(width, height);
            p5.noStroke();
            p5.frameRate(frameRate);
            setupPiano(p5);

            // await Tone.start();
            //sprite_test = new p5.Sprite();
        }

        p5.draw = ()=>{
            p5.background(p5.color(colors.back));
            drawPiano(key, press, p5);
            grid()
            layerdrawing(mainLayerHeight, layer);
            timeCursor();
            timegoes();
        }

        function timeCursor(){
            p5.strokeCap(p5.ROUND)
            p5.strokeWeight(lineWidth);
            p5.stroke(colors.default);
            p5.fill(colors.default);
            let X = pointer/(numBarShow*256) * layerWidth + startingPoint;
            p5.ellipse(X, lineWidth*15, lineWidth*15*2);
            p5.line(X, 0, X, mainLayerHeight+height/10);
        }
        
        function timegoes(){
            absoluteTick ++
            if (cursorMode){
                pointer++
                if (pointer>=numBarShow/2*256){cursorMode = false}
            } else{
                if (showLocation>(NumBar-numBarShow)*256){
                    pointer++
                    if (pointer>=numBarShow*256){
                        cursorMode = true
                        pointer = 0;
                        showLocation = 0;
                        absoluteTick = 0;
                    }
                }
                else {showLocation ++}
            }
        }
        
        //For element moving
        function timeToX(bar, start){
            let tick = (bar-1)*256 +start - showLocation;
            let X = tick/(numBarShow*256) * layerWidth + startingPoint;
            return X;
        }        

        function grid(){
            p5.strokeCap(p5.ROUND)
            p5.strokeWeight(lineWidth);
            let gridColor = p5.color(colors.default);
            gridColor.setAlpha(50)
            p5.stroke(gridColor);
            for (let i = 0 ; i<=numBarShow; i++){
                let X = timeToX(Math.floor(showLocation/256)+i+1, 0);
                if (X>startingPoint){p5.line(X, 0, X, mainLayerHeight+height/10);}
            }
        }

        function layerdrawing(yLocation, layer){
            let inst = layer.Inst;
            let points = layer.points;
            p5.strokeWeight(lineWidth);
            p5.stroke(p5.color(colors.default));
            p5.strokeCap(p5.SQUARE)

            p5.line(startingPoint, yLocation, width, yLocation);
            p5.noStroke();
            p5.fill(colors.default);
            p5.ellipse(startingPoint, yLocation, lineWidth*10);

            p5.blendMode(p5.HARD_LIGHT);
            let layerColor = p5.color(colors.default)
            if (inst == 'Piano' || inst == 'Trumpet'){
                
                p5.strokeCap(p5.ROUND);
                p5.strokeWeight(duraWidth);
                if (inst == 'Piano'){layerColor =p5.color(colors.blue)}
                else if (inst == 'Trumpet'){layerColor =p5.color(colors.purple)}
                layerColor.setAlpha(90);

                p5.stroke(layerColor);
                for (let point of points){
                    let xi = timeToX(point.bar, point.start);
                    let xf = timeToX(point.bar, point.start+point.duration);
                    //console.log(xi, xf)
                    if (xf>startingPoint && xi<width){
                        if (xf>width){xf = width}
                        if (xi<startingPoint){xi = startingPoint}
                        p5.line(xi, yLocation, xf, yLocation);
                    }
                }
                p5.strokeCap(p5.SQUARE);
            }
            p5.blendMode(p5.BLEND);
        }

    }
    
    let newStart = 0;
    let newPitch = null;
    function keyPressed(event) {
        //System key
        key = event.key;
        press = 1;

        newPitch = playPiano(key);
        console.log(newPitch);

        // Tone.loaded().then(() => {
		// 	sampler.triggerAttack(newPitch);
		// 	// const start = Tone.now();
		// 	// timerecord.push(start);
		// 	// console.log(`start: ${timerecord}`);
		// });

        if (!newStart && newPitch){
            newStart = absoluteTick
            layer.points.push(
                {pitch: newPitch,
                bar: Math.floor(newStart/256)+1,
                start: newStart%256,
                duration: 1})
        } else{
            layer.points[layer.points.length - 1].duration = absoluteTick - newStart;
        }

    }

    function keyUped(event) {
        //System key

        key = event.key;
        press = 0;

        // Tone.loaded().then(() => {
		// 	sampler.triggerRelease(newPitch);
		// 	// timerecord.push(Tone.now());
		// 	// console.log(`end: ${timerecord}`);
		// 	// const point = {
		// 	// 	pitch: "C4",
		// 	// 	bar: 1,
		// 	// 	start: Tone.Time(timerecord[0]).toBarsBeatsSixteenths(),
		// 	// 	duration: Tone.Time(timerecord[1]-timerecord[0]).toNotation(),
		// 	// 	// refer to https://github.com/Tonejs/Tone.js/wiki/Time
		//     // };
        //     // points.push(point);
		// 	// console.log(points);
		// 	// timerecord = [];
		// });

        newPitch = null;
        newStart = 0;

    }
    let sketchId;
    // let toneId;
    onMount(function () {
    let myp5 = new p5(sketch, sketchId);
    // let mytone = new Tone(sampler, toneId);
    });
</script>

<!-- <Piano bind:this={piano} /> -->

<div {sketchId} />
<!-- <div {toneId} /> -->

<svelte:window on:keydown|preventDefault={keyPressed}
                on:keyup|preventDefault={keyUped} />