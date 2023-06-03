

<script>
    import { onMount } from 'svelte';
    
    export let [width, height, layer, layers, NumBar] = [400,300, {}, []];
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
    const startingPoint = width/3 
    const layerWidth = width-startingPoint;
    const lineWidth = height/700;
    const duraWidth = height/15;
    let BPM = 60;
    
    let absoluteTick = 0;
    const sketch = (p5) =>{
        // If true, time cursor will move
        let cursorMode = true;
        //showLocation: location of displayed starting point, previous bar*256 + location in bar -1
        let showLocation = 0;
        //pointer: location of time cursor (also a tick)
        let pointer = 0;
        const mainLayerHeight = height/3;

        //4/4 => 60/(BPM/4)s = 1 bar time. 1 bar = 256 tick
        // 1 bar time / 256 = 1 tick time
        // inverse of 1 tick time = fr
        let frameRate = 1/(60/(BPM/4)/256)
        console.log(frameRate);

        let timeCursor
        p5.setup = async ()=>{
            p5.createCanvas(width, height);
            
            p5.noStroke();
            p5.frameRate(frameRate);
            timeCursor = timeCursorMake();
        }
        p5.draw = ()=>{
            p5.clear();
            p5.background(p5.color(colors.back));
            keyboardHandler()
            grid()
            layerdrawing(mainLayerHeight, layer);
            timeCursorMove()
            timegoes()
        }
        let newStart = 0;
        let newPitch = null;
        function keyboardHandler(){
            if (p5.kb.presses('space')) {
	            newPitch = 'C8';
                newStart = absoluteTick
            }
            if (newPitch){
                layer.points.push(
                    {pitch: newPitch, 
                    bar: Math.floor(newStart/256)+1,
                    start: newStart%256,
                    duration: 1})
                newPitch = null;
            }
            if (p5.kb.pressing()) {
	            layer.points[layer.points.length - 1].duration = absoluteTick - newStart;
            }
            if (p5.kb.released()){
                newStart = 0;
                console.log(timeCursor.mouse)
            }

        }

        function timeCursorMake(){
            let timeCursor = new p5.Sprite(100, 100, lineWidth*15*2, lineWidth*15*2);
            timeCursor.draw = ()=>{
                p5.strokeCap(p5.ROUND)
                p5.strokeWeight(lineWidth);
                p5.stroke(colors.default);
                p5.fill(colors.default)
                p5.ellipse(0, 0, lineWidth*15*2);
                p5.line(0, 0, 0, mainLayerHeight+height/10);
            }
            return timeCursor
        }
        function timeCursorMove(){
            let X = pointer/(numBarShow*256) * layerWidth + startingPoint;
            timeCursor.pos = {x:X,y: lineWidth*15}
            if (timeCursor.mouse.dragging()) {
                let mouseLocation = p5.mouse.x;
                let relLocation = mouseLocation-X;
                timeCursor.pos.x = Math.max(startingPoint, mouseLocation)// + timeCursor.mouse.x
                console.log(absoluteTick)
                absoluteTick = absoluteTick + relLocation/layerWidth*(numBarShow*256) * 0.1
                if (absoluteTick<=0) absoluteTick = 0;
                else if(absoluteTick>=NumBar*256) absoluteTick = NumBar*256;

	        }

        }


        function timegoes(){
            absoluteTick ++
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
        /*
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
        */

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
    


    let sketchId;
    onMount(function () {
    let myp5 = new p5(sketch, sketchId);
    });
</script>




<div {sketchId} />



