<script>
    import { onMount } from 'svelte';
    // import * as Tone from 'tone';
    import { setupPiano, keyboardHandlerPiano } from './Piano.svelte';

    import { setupSettings, playSettings } from './LayerSettings.svelte';
    
    export let [width, height, layers, layerToSee, NumBar] = [400,300, {}, []];
    let layer = layers[layerToSee];
    let inst = layer.Inst;
    console.log(width, height, layer, NumBar)
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
    const startingPoint = width/2.5
    const layerWidth = width-startingPoint;
    const lineWidth = height/700;
    const layerInstLineWidth = height/15
    const maxAmpRadius = height/8
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

    let absoluteTick = 0;
    const sketch = (p5) =>{
        let timeCursor
        //showLocation: location of displayed starting point, previous bar*256 + location in bar -1
        let showLocation = 0;
        //pointer: location of time cursor (also a tick)
        let pointer = 0;
        const mainLayerHeight = height/3;
        const otherLayerHeight = height/6;
        const gridHeight =  mainLayerHeight+height/10
        //4/4 => 60/(BPM/4)s = 1 bar time. 1 bar = 256 tick
        // 1 bar time / 256 = 1 tick time
        // inverse of 1 tick time = fr
        let frameRate = 1/(60/(BPM/4)/256)
        //console.log(frameRate);

        let isPlay = 0;
        let interactionTile
        p5.setup = async ()=>{
            p5.noCursor()
            p5.createCanvas(width, height);
            p5.noStroke();
            p5.frameRate(frameRate);
            makeInteractionField()
            setupPiano(p5, width, height);
            setupSettings(p5, width, height)
            timeCursor = timeCursorMake();
            // await Tone.start();
            
        }

        p5.draw = ()=>{
            p5.clear();
            p5.background(p5.color(colors.back));
            
            grid()
            layerdrawing(mainLayerHeight, layer);
            keyboardHandler()
            for (let i=0; i<layers.length;i++){if (i != layerToSee) layerdrawing(otherLayerHeight, layers[i]);}
             
            timeCursorMove()
            mouseHandler()
            timegoes();

        }


        function makeInteractionField(){
            let fieldColor = p5.color(colors.back)
            fieldColor.setAlpha(0);

            interactionTile = new p5.Sprite((startingPoint+width)/2, (gridHeight+height)/2, (width - startingPoint), (height - gridHeight), 'kinematic')
            interactionTile.color =  fieldColor;
            interactionTile.stroke =  fieldColor;
        }

        function keyboardHandler(){
            //pause
            if (p5.kb.presses('space')) {
                isPlay = !isPlay;

            }
            if (inst == "Piano") keyboardHandlerPiano(p5, layer, absoluteTick);
        }

        let newStart = 0;
        let isDrag = 0;
        function mouseHandler(){
            //interaction section
            //console.log(p5.mouseX, p5.mouseY)
            p5.noStroke()
            p5.blendMode(p5.HARD_LIGHT);
            layerColoring(inst)
            if (isDrag || interactionTile.mouse.hovering()) {
                p5.fill(layerColor);
                p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);


                layerColor.setAlpha(100)
                if (inst == "Base") mouseHandlerBase();
                layerColor.setAlpha(90)

            } else{
                p5.fill(colors.default);
                p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);
            }

            p5.blendMode(p5.BLEND);
        }

        let tempXY = [0, 0]
        let amplitude
        let radi
        let tempRadi = 0;
        function mouseHandlerBase(){
            p5.strokeCap(p5.ROUND)
            newStart = absoluteTick; 
            if (interactionTile.mouse.presses()) {
                tempXY = [p5.mouseX, p5.mouseY];
                isDrag = 1;
            }
            else if (interactionTile.mouse.pressing()) {
                let maxRadi = maxAmpRadius*2
                radi = Math.sqrt(Math.pow(p5.mouseX-tempXY[0], 2)+Math.pow(p5.mouseY-tempXY[1], 2))
                radi = (radi>=maxRadi? maxRadi: radi);
                p5.ellipse(tempXY[0], tempXY[1], lineWidth*40);
                p5.ellipse(tempXY[0], tempXY[1], radi*2);
                p5.noFill()
                p5.stroke(layerColor);
                p5.strokeWeight(lineWidth*2)
                p5.ellipse(tempXY[0], tempXY[1], maxRadi*2);
                p5.line(tempXY[0], tempXY[1], p5.mouseX, p5.mouseY)
                amplitude = Math.floor(Math.pow(radi, 2)/Math.pow(maxRadi, 2)*100)
                
            }
            else if (interactionTile.mouse.released()){
                isDrag = 0;
                tempRadi = radi;
                if (amplitude>10) layer.points.push(
                                {amp: amplitude, 
                                bar: Math.floor(newStart/256)+1,
                                start: newStart%256,})
            }
            if(tempRadi > 5){
                tempRadi  = tempRadi*0.8;
                p5.ellipse(tempXY[0], tempXY[1], tempRadi*2);
            } else tempRadi = 0;
           
        }

        function timeCursorMake(){
            let timeCursor = new p5.Sprite(100, 100, lineWidth*15*2, lineWidth*15*2);
            timeCursor.draw = ()=>{
                p5.strokeCap(p5.ROUND)
                p5.strokeWeight(lineWidth);
                p5.stroke(colors.default);
                p5.fill(colors.default)
                p5.ellipse(0, 0, lineWidth*15*2);
                p5.line(0, -lineWidth*15, 0, gridHeight- lineWidth*15);
            }
            p5.noStroke();
            return timeCursor
        }
        function timeCursorMove(){
            let X = pointer/(numBarShow*256) * layerWidth + startingPoint;
            timeCursor.pos = {x:X,y: lineWidth*15}
            if (timeCursor.mouse.dragging()) {
                let mouseLocation = p5.mouse.x;
                let relLocation = mouseLocation-X;
                timeCursor.pos.x = Math.max(startingPoint, mouseLocation)// + timeCursor.mouse.x
                absoluteTick = absoluteTick + relLocation/layerWidth*(numBarShow*256) * 0.1
                if (absoluteTick<=0) absoluteTick = 0;
                else if(absoluteTick>=NumBar*256) absoluteTick = NumBar*256;

	        }

        }


        function timegoes(){
            if(isPlay){absoluteTick ++}

            if (absoluteTick<=numBarShow/2*256){
                pointer = absoluteTick
                showLocation = 0;
            } else if (absoluteTick>(NumBar-numBarShow/2)*256){
                pointer = absoluteTick - (NumBar-numBarShow)*256; 
                showLocation = (NumBar-numBarShow)*256;
                if (absoluteTick>=NumBar*256){
                    absoluteTick = 0;
                }
            }
            else {
                pointer =numBarShow/2*256;
                showLocation =absoluteTick - numBarShow/2*256}
            
        }
        //For element moving
        function timeToX(bar, start){
            let tick = (bar-1)*256 +start - showLocation;
            let X = tick/(numBarShow*256) * layerWidth + startingPoint;
            return X;
        }
        
        //For decoding drag
        let xToTick  = (X) => (X-startingPoint)*numBarShow*256/layerWidth
        let tickToTime = (tick) => [Math.floor((tick+showLocation)/256)+1, Math.round((tick+showLocation)%256)]


        function grid(){
            p5.strokeCap(p5.ROUND)
            p5.strokeWeight(lineWidth);
            let gridColor = p5.color(colors.default);
            gridColor.setAlpha(50)
            p5.stroke(gridColor);
            for (let i = 0 ; i<=numBarShow; i++){
                let X = timeToX(Math.floor(showLocation/256)+i+1, 0);
                if (X>startingPoint){p5.line(X, 0, X, gridHeight);}
            }
        }
        let layerColor
        function layerColoring(inst){
            
            if (inst == 'Piano'){layerColor =p5.color(colors.blue)}
            else if (inst == 'Trumpet'){layerColor =p5.color(colors.purple)}
            else if (inst == 'Base'){layerColor =p5.color(colors.purple)}
            else if (inst == 'Snare'){layerColor =p5.color(colors.yellow)}
            else if (inst == 'Cymbal'){layerColor =p5.color(colors.pink)}
            else if (inst == 'Guitar'){layerColor =p5.color(colors.green)}
            layerColor.setAlpha(90);
        }

        function layerdrawing(yLocation, layer){
            
            let points = layer.points;
            let inst = layer.Inst;
            p5.strokeWeight(lineWidth);
            p5.fill(p5.color(colors.default));
            p5.stroke(p5.color(colors.default));
            p5.strokeCap(p5.SQUARE)

            p5.line(startingPoint, yLocation, width, yLocation);
            p5.noStroke();
            p5.fill(colors.default);
            p5.ellipse(startingPoint, yLocation, lineWidth*10);

            p5.blendMode(p5.HARD_LIGHT);

            layerColoring(inst)
            if (inst == 'Piano' || inst == 'Trumpet'){
                p5.strokeCap(p5.ROUND);
                p5.strokeWeight(layerInstLineWidth);
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
            } else if (inst == 'Base' || inst == 'Snare' || inst == 'Cymbal' || inst == 'Guitar'){
                p5.noStroke();
                p5.fill(layerColor)
                for (let point of points){
                    let x = timeToX(point.bar, point.start);

                    if (x>startingPoint && x<width){
                        if (x>width){x = width}
                        if (x<startingPoint){x = startingPoint}
                        p5.ellipse(x, yLocation, maxAmpRadius*Math.sqrt(point.amp/100));
                    }
                }
                p5.strokeCap(p5.SQUARE);
            } 
            p5.blendMode(p5.BLEND);
        }

    }
    
    let newStart = 0;
    let newPitch = null;

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
