<script>
    import { onMount, createEventDispatcher } from 'svelte';
    // import * as Tone from 'tone';
    import {colors, numBarShow, startingPoint, layerWidth, lineWidth, layerInstLineWidth,  maxAmpRadius} from './Constants.svelte';

    import { setupPiano, keyboardHandlerPiano } from './Piano.svelte';
    import {mouseHandlerBase} from './Base.svelte';

 
    import {timeCursorMake,  timeCursorMove, grid, layerColoring, layerdrawing} from './LayerSettings.svelte';
    
    export let [width, height, layers, layerToSee, NumBar] = [400,300, {}, []];
    let layer = layers[layerToSee];
    let inst = layer.Inst;
    console.log(width, height, layer, NumBar)

    //max number of bar in one display
    //const numBarShow = 3;

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
        let interactionTile

        let backIcon
        p5.preload =async ()=>{
            backIcon = p5.loadImage('assets/Back.png');
        }

        p5.setup = async ()=>{
            p5.noCursor()
            p5.createCanvas(width, height);
            p5.noStroke();
            p5.frameRate(frameRate);
            makeInteractionField()
           // setupPiano(p5, width, height);
            timeCursor = timeCursorMake(p5, gridHeight);
            // await Tone.start();
            makeButtons()
        }

        p5.draw = ()=>{
            p5.clear();
            p5.background(p5.color(colors.back));
            grid(p5, gridHeight, showLocation)
            drawSettings (inst)
            layerdrawing(p5, mainLayerHeight, layer);
            for (let i=0; i<layers.length;i++){if (i != layerToSee) layerdrawing(p5, otherLayerHeight, layers[i]);}
            keyboardHandler()
            absoluteTick = timeCursorMove(p5, timeCursor, pointer, absoluteTick, NumBar)
            mouseHandler()
            timegoes();
        }
        let backButton, duplButton, bpmButton, playButton
        function makeButtons(){
            let highToolY = height/13
            const buttonDia = width/20
            function makeButton(text, func, order){
                let tempButton = new  p5.Sprite(width/20+buttonDia/2+order*buttonDia*1.1, highToolY,buttonDia,buttonDia, 'kinematic')
                tempButton.img = 'assets/'+text+'.png'
                tempButton.draw = () =>{
                    p5.image(tempButton.img, 0, 0, buttonDia, buttonDia)
                        if(tempButton.mouse.presses()){
                        func()
                    }
                    if(tempButton.mouse.hovering()){
                        p5.fill('rgba(200,200,200, 0.25)')
                        p5.ellipse(0, 0, buttonDia)
                    }
                }
                return tempButton
            }

            backButton = makeButton('Back', toggleToProject, 0)
            duplButton = makeButton('DuplicateLayer', placeholder, 1)
            bpmButton = makeButton('BPMIcon', placeholder, 3)
            playButton = makeButton('songPlay', function(){isPlay = !isPlay}, 4)



        }

        function placeholder(){

        }
        function toggleToProject(){
            p5.remove();
            dispatch('layer', false);
        }
        let inst_description = 
        {
            Piano: 'How to play: \nPress keyboard'
        }
        
        function drawSettings (inst) {
            p5.fill('#f5fafa');
            p5.textFont('Pretendard Black');
            let width_ratio = p5.width/1920;
            let height_ratio = p5.height/1080;
            p5.noStroke();
            p5.textSize(width_ratio*60);
            p5.text(inst,width_ratio*120,height_ratio*204);
            
            p5.textFont('Pretendard Medium');
            p5.textSize(width_ratio*30);
            p5.text(inst_description[inst],width_ratio*120,height_ratio*351);
            
            if (inst=='Guitar'){
                p5.textSize(width_ratio*20);
                p5.text('pitch',width_ratio*120,height_ratio*474);
            }

            p5.textSize(width_ratio*20);
            p5.text('Layer Amp',width_ratio*120,height_ratio*869);
        };

        function makeInteractionField(){
            let fieldColor = p5.color(colors.back)
            fieldColor.setAlpha(0);

            interactionTile = new p5.Sprite((startingPoint+width)/2, (gridHeight+height)/2, (width - startingPoint), (height - gridHeight), 'kinematic')
            interactionTile.color =  fieldColor;
            interactionTile.stroke =  fieldColor;
        }

        function keyboardHandler(){
            //pause
            if (p5.kb.presses('space')) {isPlay = !isPlay;}

            if (inst == "Piano") keyboardHandlerPiano(p5, layer, absoluteTick);
        }
        

        let layerColor
        function mouseHandler(){
            //interaction section
            //console.log(p5.mouseX, p5.mouseY)
            p5.noStroke()
            p5.blendMode(p5.HARD_LIGHT);
            layerColor= layerColoring(inst, p5)
            if (interactionTile.mouse.hovering()) {
                p5.fill(layerColor);
                p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);
                layerColor.setAlpha(100)
                if (inst == "Base") mouseHandlerBase(p5, layer, absoluteTick, interactionTile);
                layerColor.setAlpha(90)
            } else{
                p5.fill(colors.default);
                p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);
            }
            p5.blendMode(p5.BLEND);
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
        //For decoding drag
        let xToTick  = (X) => (X-startingPoint)*numBarShow*256/layerWidth
        let tickToTime = (tick) => [Math.floor((tick+showLocation)/256)+1, Math.round((tick+showLocation)%256)]
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
