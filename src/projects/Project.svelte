<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { colors, numBarShow, startingPoint, layerWidth, lineWidth,  HeightBetLayer, text_end, BPMorigin, MasterVolOrigin, text_start } from '../Constants.svelte';
    import { timeCursorMake,  timeCursorMove, grid, layerColoring, layerdrawing, makeButton, makeLayerSp } from '../layers/LayerSettings.svelte';
    import { ref, child, get, set, getDatabase, onValue } from 'firebase/database';

    export let [width, height, project, projToSee, NumBar] = [400,300, {}, []];
    
    let layers = project.Layers;

    console.log(width, height, NumBar)

    //max number of bar in one display
    //const numBarShow = 3;

    let BPM = BPMorigin;
    let masterVol = MasterVolOrigin;

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
        },
    ];
    let instList = ["piano", "guitar", "base", "cymbal", "snare"];
    const pianoPitchList = ['C#3','D#3','F#3','G#3','A#3','C#4','D#4','F#4','G#4','A#4','C#5','D#5','F#5','G#5','A#5','C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4','A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
    const guitarPitchList = ['C#3','D#3','F#3','G#3','A#3','C#4','C3','D3','E3','F3','G3','A3','B3','C4','D4'];

    const dispatch=createEventDispatcher();
    let absoluteRaw = 0;
    let absoluteTick = 0;
    const sketch = (p5) =>{
        let timeCursor
        //showLocation: location of displayed starting point, previous bar*256 + location in bar -1
        let showLocation = 0;
        //pointer: location of time cursor (also a tick)
        let pointer = 0;
        //4/4 => 60/(BPM/4)s = 1 bar time. 1 bar = 256 tick
        // 1 bar time / 256 = 1 tick time
        // inverse of 1 tick time = fr
        let frameRate = 1/(60/(BPM/4)/256)

        let isPlay = 0;

        let incrementMulti = 1;

        p5.preload = () => {
            loadSoundtrack(soundObject);
        }

        p5.setup = async ()=>{
            p5.noCursor()
            p5.createCanvas(width, height);
            p5.noStroke();
            p5.frameRate(frameRate);
            textSprites()
            timeCursor = timeCursorMake(p5, height);
            makeButtons()
            makeLayerSps()
        }

        let showHeight = 0;
        p5.draw = ()=>{
            p5.clear();
            p5.background(p5.color(colors.back));
            popUp()
            grid(p5, height, showLocation)
            drawSettings ()
            
            for (let i=0; i<layers.length;i++){
                layerdrawing(p5, showHeight+(i+1)*HeightBetLayer, layers[i]);
            }
            keyboardHandler()
            absoluteRaw = timeCursorMove(p5, timeCursor, pointer, absoluteRaw, NumBar)
            mouseHandler()
            timegoes();
            writeData(project);
        }

        function writeData(project) {
            const db = getDatabase();
            set(ref(db, `${projToSee}`), project);
        }

        p5.mouseWheel = (a)=>{
            if (p5.mouseX>startingPoint){
                showHeight+=((a.delta>0)? -1:1)*height/25
                updateLayerSps()
            }
        }

        let layerSps=[]
        function makeLayerSps(){
            for (let i=0; i<layers.length;i++){
                layerSps.push(makeLayerSp(p5, toggleToLayer, showHeight, i, i))
            }
        }

        let backButton, duplButton, ampButton, bpmButton, playButton
        let layerMakers = []
        
        function makeButtons(){
            backButton = makeButton(p5, 'Back', projToTot , 0, 0)
            duplButton = makeButton(p5, 'AddProject', dupProject, 1, 0)
            ampButton = makeButton(p5, 'AmpIcon', amplitudeChanger, 2)
            bpmButton = makeButton(p5, 'BPMIcon', BPMchanger, 3)
            playButton = makeButton(p5, 'songPlay', function(){isPlay = !isPlay}, 4)


            // instruments
            const insts = ['piano', 'guitar', 'base', 'cymbal', 'snare']
            let magicLocationNumber = 9
            for (let inst of insts){
                let tempButton = makeButton(p5, inst, makeNewLayer, magicLocationNumber+insts.indexOf(inst), inst)
                tempButton.y = height*12/13
                layerMakers.push(tempButton)
            }
        }
        function projToTot(){
            dispatch('projToTot')
            dispatch('projectTexts', [project_title, project_description])
            p5.remove()
        }
        
        function dupProject(){
            dispatch('projDup')
            p5.remove()
        }

        function makeNewLayer(inst){
            let newLayer = {}
            newLayer.Inst = inst
            newLayer.Amplitude = 1
            newLayer.points = []
            layers.push(newLayer)
            let index = layers.length - 1
            layerSps.push(makeLayerSp(p5, toggleToLayer, showHeight, index, index))
        }

        let ampindex = 4;
        let amppup = 0;
        function amplitudeChanger(){
            const ampmulti = [0.2, 0.4, 0.6, 0.8, 1]
            ampindex = ((ampindex>=(ampmulti.length-1))? 0: ampindex+1);
            masterVol = ampmulti[ampindex];
            amppup = 70;
            console.log(masterVol);
        }
        
        let BPMindex = 0
        let BPMpup = 0;
        function BPMchanger(){
            const BPMmulti = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5]
            BPMindex = ((BPMindex>=(BPMmulti.length-1))? 0: BPMindex+1);
            BPM = BPMorigin*BPMmulti[BPMindex]
            frameRate = 1/(60/(BPM/4)/256)
            p5.frameRate(frameRate);
            BPMpup = frameRate;
            incrementMulti = BPMmulti[BPMindex]
            console.log(BPM);
        }

        function popUp(){
            if(BPMpup){
                let fieldColor = p5.color(colors.default)
                fieldColor.setAlpha(100*BPMpup/frameRate);
                p5.fill(fieldColor)
                p5.textFont('Pretendard Medium');
                p5.textAlign(p5.CENTER, p5.CENTER)
                p5.textSize(height/3);
                p5.text('BPM = '+ BPM,width/2, height/2 )
                BPMpup--
                p5.textAlign(p5.LEFT, p5.TOP)
            }
            if(amppup){
                let fieldColor = p5.color(colors.default)
                fieldColor.setAlpha(100*amppup/frameRate);
                p5.fill(fieldColor)
                p5.textFont('Pretendard Medium');
                p5.textAlign(p5.CENTER, p5.CENTER)
                p5.textSize(height/5);
                p5.text('PLAY VOL = '+ masterVol +'x', width/2, height/2 )
                amppup--
                p5.textAlign(p5.LEFT, p5.TOP)
            }
        }

        function updateLayerSps(){
            if (layerSps.length>0) for (let layerSp of layerSps) layerSp.udt(showHeight)
        }

        function toggleToLayer(toLayer){
            p5.remove();
            dispatch('projectTexts', [project_title, project_description])
            dispatch('layernum', toLayer)
            dispatch('layer', false);
        }

        let project_title = project.Title;
        let project_description = project.Desc;
        function drawSettings () {
            p5.fill('#f5fafa');
            p5.textFont('Pretendard Black');
            let width_ratio = width/1920;
            p5.noStroke();
            p5.textSize(width_ratio*60);
            p5.textWrap(p5.CHAR);
            p5.text(project_title,text_start,height*0.2, text_end);
            
            p5.textFont('Pretendard Medium');
            p5.textSize(width_ratio*30);
            p5.text(project_description,text_start,height*0.4, text_end);
        };
  
        let titleTile, descTile
        let titleOK = false
        let descOK = false
        function textSprites(){
            let fieldColor = p5.color(colors.default)
            fieldColor.setAlpha(30);
            titleTile = new p5.Sprite((text_end+text_start*2)/2, height*0.27, text_end, (height*0.2), 'kinematic')
            titleTile.color =  fieldColor;
            titleTile.stroke = fieldColor;

            titleTile.draw = () =>{
                if(titleTile.mouse.hovering()){
                    p5.fill(fieldColor);
                    p5.rect(0, 0, text_end, (height*0.2))
                    titleOK =true;
                } else{ titleOK = false }}

            descTile = new p5.Sprite((text_end+text_start*2)/2, height*0.59, text_end, (height*0.4), 'kinematic')
            descTile.color =  fieldColor;
            descTile.stroke =  fieldColor;
            descTile.draw = () =>{
                if(descTile.mouse.hovering()){
                    p5.fill(fieldColor);
                    p5.rect(0, 0, text_end, (height*0.4))
                    descOK =true;
                } else{ descOK = false }}
        }

        let isUser=true
        p5.keyTyped=()=>{
            if (titleOK && isUser &&(project_title.length<25)){
                project_title = project_title+p5.key
                project.Title = project_title;
            }
            if (descOK && isUser &&(project_description.length<200)){
                project_description = project_description+p5.key
                project.Desc = project_description;
            }
        }

        p5.keyPressed=()=>{
            if (titleOK && isUser){
                if(p5.key=='Backspace'){project_title = project_title.slice(0, -1);}
                else if(p5.key==' '){project_title = project_title+' '}
            }
            if (descOK && isUser){
                if(p5.key=='Backspace'){project_description = project_description.slice(0, -1);}
                else if(p5.key==' '){project_description = project_description+' '}
            }
        }

        function keyboardHandler(){
            //pause
            if(!(titleOK) && !(descOK)){
                if (p5.kb.presses('space')) {isPlay = !isPlay;}
            }
        }
        
        let isDrag = 0;
        let layerColor
        function mouseHandler(){
            //interaction section
            p5.noStroke()
            p5.blendMode(p5.HARD_LIGHT);
            layerColor= layerColoring('piano', p5)

            p5.fill(colors.default);
            p5.ellipse(p5.mouseX, p5.mouseY, lineWidth*20);
            
            p5.blendMode(p5.BLEND);
        }

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
                absoluteRaw = absoluteRaw+incrementMulti
                absoluteTick = Math.floor(absoluteRaw)
            }

            if (absoluteRaw<=numBarShow/2*256){
                pointer = absoluteRaw
                showLocation = 0;
            } else if (absoluteRaw>(NumBar-numBarShow/2)*256){
                pointer = absoluteRaw - (NumBar-numBarShow)*256; 
                showLocation = (NumBar-numBarShow)*256;
                if (absoluteRaw>=NumBar*256){
                    absoluteRaw = 0;
                    absoluteTick = 0;
                }
            }
            else {
                pointer =numBarShow/2*256;
                showLocation =absoluteRaw - numBarShow/2*256}
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
    }

    let sketchId;
    onMount(function () {
    let myp5 = new p5(sketch, sketchId);
    });

</script>

<div {sketchId} />