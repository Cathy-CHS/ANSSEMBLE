<script>
    import { onMount, createEventDispatcher } from 'svelte';
    // import * as Tone from 'tone';
    import {colors, numBarShow, startingPoint, layerWidth, lineWidth, layerInstLineWidth,  maxAmpRadius} from './Constants.svelte';


    import {timeCursorMake,  timeCursorMove, grid, layerColoring, layerdrawing} from './LayerSettings.svelte';

    export let [width, height, layers, layerToSee, NumBar] = [400,300, {}, []];
    let layer = layers[layerToSee];
    let inst = layer.Inst;
    console.log(width, height, layer, NumBar)

    //max number of bar in one display
    //const numBarShow = 3;

    let BPM = 60;

    let soundObject = [
        {
            Inst: "piano",
            Soundtrack: []
        },
        {
            Inst: "base",
            Soundtrack: []
        }
    ];
    let instList = ["piano", "base", "cymbal"];
    const pianoPitchList = ['C#3','D#3','F#3','G#3','A#3','C#4','D#4','F#4','G#4','A#4','C#5','D#5','F#5','G#5','A#5','C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4', 'A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];

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
    const dispatch=createEventDispatcher();
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
        let interactionTile;

        p5.preload = () => {
            loadSoundtrack(soundObject);
        }

        p5.setup = async ()=>{
            p5.noCursor()
            p5.createCanvas(width, height);
            p5.noStroke();
            p5.frameRate(frameRate);
            makeLayerBackSprite()
           // setupPiano(p5, width, height);
            timeCursor = timeCursorMake(p5, height);
            // await Tone.start();
            
        }
        let showHeight = 0;
        p5.draw = ()=>{
            p5.clear();
            p5.background(p5.color(colors.back));
            
            grid(p5, height, showLocation)
            drawSettings (inst)

            for (let i=0; i<layers.length;i++){
                layerdrawing(p5, showHeight+(i+1)*height/7, layers[i]);
            }
            keyboardHandler()
            absoluteTick = timeCursorMove(p5, timeCursor, pointer, absoluteTick, NumBar)
            mouseHandler()
            timegoes();
            toggleToLayer();
        }

        function toggleToLayer(){
            if (p5.kb.presses('1')) {
                console.log('asdf')
                p5.remove();
                dispatch('layer', false);
                //checker()

            }
        }
        let inst_description = 
        {
            Piano: 'How to play: \nPress keyboard'
        }
        
        function drawSettings (inst) {
            p5.fill('#f5fafa');
            p5.textFont("pretendard");
            let width_ratio = p5.width/1920;
            let height_ratio = p5.height/1080;
            p5.noStroke();
            p5.textSize(width_ratio*60);
            p5.text('Project title',width_ratio*120,height_ratio*204);
            
            p5.textSize(width_ratio*25);
            p5.text(inst_description[inst],width_ratio*120,height_ratio*351);
            
            if (inst=='guitar'){
                p5.textSize(width_ratio*20);
                p5.text('pitch',width_ratio*120,height_ratio*474);
            }

            p5.textSize(width_ratio*20);
            p5.text('Layer Amp',width_ratio*120,height_ratio*869);
        };

        function makeLayerBackSprite(){
            let fieldColor = p5.color(colors.back)
            fieldColor.setAlpha(0);

            interactionTile = new p5.Sprite((startingPoint+width)/2, (gridHeight+height)/2, (width - startingPoint), (height - gridHeight), 'kinematic')
            interactionTile.color =  fieldColor;
            interactionTile.stroke =  fieldColor;
        }

        function keyboardHandler(){
            //pause
            if (p5.kb.presses('space')) {isPlay = !isPlay;}
        }
        
        let isDrag = 0;
        let layerColor
        function mouseHandler(){
            //interaction section
            //console.log(p5.mouseX, p5.mouseY)
            p5.noStroke()
            p5.blendMode(p5.HARD_LIGHT);
            layerColor= layerColoring(inst, p5)
            if (isDrag || interactionTile.mouse.hovering()) {
                p5.fill(layerColor);
                p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);
                layerColor.setAlpha(100)
            } else{
                p5.fill(colors.default);
                p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);
            }
            p5.blendMode(p5.BLEND);
        }


        function timegoes(){
            if(isPlay){
                for (let layer of layers) {
                    for (let point of layer.points) {
                        if (absoluteTick == (point.bar-1)*256+point.start) {
                            // console.log(layer.Inst);
                            if (point.hasOwnProperty("duration")) {
                                const inst = instList.indexOf(layer.Inst);
                                const pitchnum = pianoPitchList.indexOf(point.pitch);
                                soundObject[inst].Soundtrack[pitchnum].play();
                                soundObject[inst].Soundtrack[pitchnum].stop(point.duration/frameRate);
                            } else {
                                const inst = instList.indexOf(layer.Inst);
                                soundObject[inst].Soundtrack[0].play(0, 1, point.amp/100);
                            }
                        }
                    }
                }
                absoluteTick ++;
            } else {
                // pause all sound
            }

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
        //For decoding drag
        let xToTick  = (X) => (X-startingPoint)*numBarShow*256/layerWidth
        let tickToTime = (tick) => [Math.floor((tick+showLocation)/256)+1, Math.round((tick+showLocation)%256)]

        function loadSoundtrack(soundObject) {
            // piano
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Db3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Eb3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Gb3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Ab3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Bb3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Db4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Eb4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Gb4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Ab4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Bb4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Db5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Eb5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Gb5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Ab5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/Bb5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/C3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/D3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/E3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/F3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/G3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/A3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/B3.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/C4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/D4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/E4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/F4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/G4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/A4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/B4.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/C5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/D5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/E5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/F5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/G5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/A5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/B5.mp3'));
            soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/C6.mp3'));
            //bass
            soundObject[1].Soundtrack.push(p5.loadSound('assets/drum/bass.wav'));
        }
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
