<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { BPMorigin, colors, numBarShow, startingPoint, layerWidth, lineWidth, text_start, layerInstLineWidth, maxAmpRadius } from '../Constants.svelte';
    import { keyboardHandlerPiano } from '../instruments/Piano.svelte';
    import { keyboardHandlerSnare } from '../instruments/Snare.svelte';
    import { mouseHandlerBase } from '../instruments/Base.svelte';
    import { mouseHandlerCymbal } from '../instruments/Cymbal.svelte';
    import { mouseHandlerGuitar, keyboardHandlerGuitar, resetPitch } from '../instruments/Guitar.svelte';
    import { timeCursorMake, timeCursorMove, grid, layerColoring, layerdrawing, makeButton} from './LayerSettings.svelte';
    import { ref, child, get, set, getDatabase, onValue } from 'firebase/database';
    
    export let [width, height, layers, layerToSee, projToSee, NumBar] = [400,300, {}, []];

    //max number of bar in one display
    //const numBarShow = 3;

    let layer = layers[layerToSee];
    let inst = layer.Inst;
    console.log(width, height, layer, NumBar);
  
    let BPM = BPMorigin;
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
        let frameRate = 1/(60/(BPM/4)/256);

        let isPlay = 0;
        let interactionTile;
        let backIcon;

        let soundObject = [
            {
                Inst: "piano",
                Soundtrack: []
            },
            {
                Inst: "guitar",
                Soundtrack: []
            },
            {
                Inst: "base",
                Soundtrack: []
            },
            {
                Inst: "cymbal",
                Soundtrack: []
            },
            {
                Inst: "snare",
                Soundtrack: []
            }
        ];

        p5.preload = () => {
            backIcon = p5.loadImage('assets/buttons/Back.png');
            loadSoundtrack(soundObject);
        }
        
        p5.setup = async ()=>{
            p5.noCursor();
            p5.createCanvas(width, height);
            p5.noStroke();
            p5.frameRate(frameRate);
          
            makeInteractionField();
            timeCursor = timeCursorMake(p5, gridHeight);   
            makeButtons();
        }

        p5.draw = ()=>{
            p5.clear();
            p5.background(p5.color(colors.back));
            popUp()
            grid(p5, gridHeight, showLocation)
            drawSettings (inst)
            layerdrawing(p5, mainLayerHeight, layer);
            for (let i=0; i<layers.length;i++){if (i != layerToSee) layerdrawing(p5, otherLayerHeight, layers[i]);}
            keyboardHandler()
            absoluteTick = timeCursorMove(p5, timeCursor, pointer, absoluteTick, NumBar)
            mouseHandler()
            timegoes();
            writeData(layer);
        }

        function writeData(layer) {
            const db = getDatabase();
            set(ref(db, `${projToSee}/Layers/${layerToSee}`), layer);
        }

        let backButton, duplButton, ampButton, bpmButton, playButton, deleteButton
        function makeButtons(){
            backButton = makeButton(p5, 'Back', toggleToProject, 0)
            duplButton = makeButton(p5, 'DuplicateLayer', function(){dispatch('layerDup')}, 1)
            ampButton = makeButton(p5, 'AmpIcon', amplitudeChanger, 2)
            bpmButton = makeButton(p5, 'BPMIcon', BPMchanger, 3)
            playButton = makeButton(p5, 'songPlay', function(){isPlay = !isPlay}, 4)
            deleteButton = makeButton(p5, 'Delete', deleteLayer, 0)
            deleteButton.y = height*12/13;
        }

        function deleteLayer(){
            savePitches = [];
            if (inst == "guitar") resetPitch(p5);
            dispatch('deleteLayer', layerToSee)
            p5.remove();
        }

        let ampindex = 4;
        let amppup = 0;
        function amplitudeChanger(){
            const ampmulti = [0.2, 0.4, 0.6, 0.8, 1]
            ampindex = ((ampindex>=(ampmulti.length-1))? 0: ampindex+1);
            layer.Amplitude = ampmulti[ampindex];
            amppup = 70;
            console.log(layer.Amplitude);
        }

        let BPMindex = 0;
        let BPMpup = 0;
        function BPMchanger(){
            const BPMmulti = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5]
            BPMindex = ((BPMindex>=(BPMmulti.length-1))? 0: BPMindex+1);
            BPM = BPMorigin*BPMmulti[BPMindex]
            frameRate = 1/(60/(BPM/4)/256)
            p5.frameRate(frameRate);
            BPMpup = frameRate;
            console.log(BPM)
        }

        function popUp(){
            if(BPMpup){
                let fieldColor = p5.color(colors.default)
                fieldColor.setAlpha(100*BPMpup/frameRate);
                p5.fill(fieldColor)
                p5.textFont('Pretendard Medium');
                p5.textAlign(p5.CENTER, p5.CENTER)
                p5.textSize(height/3);
                p5.text('BPM = '+ BPM, width/2, height/2 )
                BPMpup--
                console.log(BPMpup);
                p5.textAlign(p5.LEFT, p5.TOP)
            }
            if(amppup){
                let fieldColor = p5.color(colors.default)
                fieldColor.setAlpha(100*amppup/frameRate);
                p5.fill(fieldColor)
                p5.textFont('Pretendard Medium');
                p5.textAlign(p5.CENTER, p5.CENTER)
                p5.textSize(height/5);
                p5.text('LAYER VOL = '+ layer.Amplitude +'x', width/2, height/2 )
                amppup--
                p5.textAlign(p5.LEFT, p5.TOP)
            }
        }

        function toggleToProject(){
            p5.remove();
            savePitches = [];
            if(inst == "guitar") resetPitch(p5);
            dispatch('layerToProject');
        }
        
        let inst_description = 
        {
            piano: 'Press keyboard.',
            guitar: 'Press keyboard to select pitches.\nThen, drag the string and let go.',
            base: 'Click, drag, and let go.',
            snare: 'Percuss keyboard.',
            cymbal: 'Hit the line with cursor.'
        }
        
        function drawSettings (inst) {
            p5.fill('#f5fafa');
            p5.textFont('Pretendard Black');
            let width_ratio = p5.width/1920;
            
            let height_ratio = p5.height/1080;
            p5.noStroke();
            p5.textSize(width_ratio*60);
            p5.textWrap(p5.CHAR);
            let instText = inst
            instText = instText.charAt(0).toUpperCase() + instText.slice(1)
            p5.text(instText,text_start,height_ratio*204, startingPoint*0.63);
            
            p5.textFont('Pretendard Medium');
            p5.textSize(width_ratio*30);
            p5.text('How to play: \n'+inst_description[inst],text_start,height_ratio*351);
            
            p5.textSize(width_ratio*20);
        };

        function makeInteractionField(){
            let fieldColor = p5.color(colors.back)
            fieldColor.setAlpha(0);

            interactionTile = new p5.Sprite((startingPoint+width)/2, (gridHeight+height)/2, (width - startingPoint)*1.2, (height - gridHeight)*1.4, 'kinematic')
            interactionTile.color =  fieldColor;
            interactionTile.stroke =  fieldColor;
        }

        let savePitches = [];
        function keyboardHandler(){
            //pause
            if (p5.kb.presses('space')) {isPlay = !isPlay;}

            //piano handler
            if (inst == "piano") {
                let existingPitches = keyboardHandlerPiano(p5, layer, absoluteTick);
                playSound(inst, layer.Amplitude, pianoPitchList, existingPitches.filter(pitch => !savePitches.includes(pitch)), null);
                stopSound(inst, pianoPitchList, savePitches.filter(pitch => !existingPitches.includes(pitch)));
                savePitches = existingPitches;
            }
            //guitar handler
            else if (inst == "guitar") {
                savePitches = keyboardHandlerGuitar(p5);
            }
            //snare handler
            else if (inst == "snare") {
                let amplitude = keyboardHandlerSnare(p5, layer, absoluteTick);
                if (amplitude) playSound(inst, layer.Amplitude, amplitude, null, null);
            }
        }

        let layerColor;
        function mouseHandler(){
            //interaction section
            p5.noStroke()
            p5.blendMode(p5.HARD_LIGHT);
            layerColor= layerColoring(inst, p5)
            if (inst == "guitar") {
                let amplitude = mouseHandlerGuitar(p5, layer, absoluteTick, savePitches, interactionTile);
                console.log("amp: "+amplitude);
                if (amplitude) playSound(inst, layer.Amplitude, amplitude, guitarPitchList, savePitches);
            }
            if (interactionTile.mouse.hovering()) {
                p5.fill(layerColor);
                p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);
                layerColor.setAlpha(100)
                if (inst == "base") {
                    let amplitude = mouseHandlerBase(p5, layer, absoluteTick, interactionTile);
                    if (amplitude) playSound(inst, layer.Amplitude, amplitude, null, null);
                }
                if (inst == "cymbal") {
                    let amplitude = mouseHandlerCymbal(p5, layer, absoluteTick, interactionTile);
                    if (amplitude) playSound(inst, layer.Amplitude, amplitude, null, null);
                }
                layerColor.setAlpha(90)
            } else{
                p5.fill(colors.default);
                p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);
            }
            p5.blendMode(p5.BLEND);
        }

        let instList = ["piano", "guitar", "base", "cymbal", "snare"];
        const pianoPitchList = ['C#3','D#3','F#3','G#3','A#3','C#4','D#4','F#4','G#4','A#4','C#5','D#5','F#5','G#5','A#5','C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
        const guitarPitchList = ['C#3','D#3','F#3','G#3','A#3','C#4','C3','D3','E3','F3','G3','A3','B3','C4','D4'];

        function timegoes(){
            if(isPlay){
                for (let layer of layers) {
                    if (layer.points) {
                        for (let point of layer.points) {
                            if (absoluteTick == (point.bar-1)*256+point.start) {
                                if (layer.Inst == 'piano') {
                                    const inst = instList.indexOf(layer.Inst);
                                    const pitchnum = pianoPitchList.indexOf(point.pitch);
                                    soundObject[inst].Soundtrack[pitchnum].play(0, 1, layer.Amplitude);
                                    soundObject[inst].Soundtrack[pitchnum].stop(point.duration/frameRate);
                                } else if (layer.Inst == 'guitar') {
                                    const inst = instList.indexOf(layer.Inst);
                                    const pitchnum = guitarPitchList.indexOf(point.pitch);
                                    soundObject[inst].Soundtrack[pitchnum].play(0, 1, layer.Amplitude*point.amp/100);
                                } else {
                                    const inst = instList.indexOf(layer.Inst);
                                    soundObject[inst].Soundtrack[0].play(0, 1, layer.Amplitude*point.amp/100);
                                }
                            }
                        }
                    }
                }
                absoluteTick ++
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
            //For decoding drag
            let xToTick  = (X) => (X-startingPoint)*numBarShow*256/layerWidth
            let tickToTime = (tick) => [Math.floor((tick+showLocation)/256)+1, Math.round((tick+showLocation)%256)]
        }

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
            // guitar
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/Cs3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/Ds3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/Fs3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/Gs3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/As3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/Cs4.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/C3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/D3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/E3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/F3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/G3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/A3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/B3.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/C4.mp3'));
            soundObject[1].Soundtrack.push(p5.loadSound('assets/guitar/D4.mp3'));
            //bass
            soundObject[2].Soundtrack.push(p5.loadSound('assets/drum/bass.wav'));
            //cymbal
            soundObject[3].Soundtrack.push(p5.loadSound('assets/drum/ride.wav'));
            //snare
            soundObject[4].Soundtrack.push(p5.loadSound('assets/drum/snare.wav'));
        }

        function playSound(inst, ampl, a, b, c) {
            if(inst == 'piano') {
                for(let i of b) {
                    soundObject[0].Soundtrack[a.indexOf(i)].play(0, 1, ampl);
                }
            }
            else if(inst == 'guitar') {
                for(let i of c) {
                    soundObject[1].Soundtrack[b.indexOf(i)].play(0, 1, ampl*a);
                }
            }
            else if(inst == 'base') {
                console.log(ampl*a);
                soundObject[2].Soundtrack[0].play(0, 1, ampl*a);
            }
            else if(inst == 'cymbal') {
                console.log(ampl*a);
                soundObject[3].Soundtrack[0].play(0, 1, ampl*a);
            }
            else if(inst == 'snare') {
                console.log(ampl*a);
                soundObject[4].Soundtrack[0].play(0, 1, ampl*a);
            }
        }
 
        function stopSound(inst, pitchList, pitches) {
            if(inst == 'piano') {
                for(let i of pitches) {
                    soundObject[0].Soundtrack[pitchList.indexOf(i)].stop();
                }
            }
        }
    }

    let sketchId;
    onMount(function () {
    let myp5 = new p5(sketch, sketchId);
    });

</script>

<div {sketchId} />