

<script>
    import P5 from "p5-svelte";
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
    const duraWidth = height/20;
    let BPM = 60;
    

    const sketch = (p5) =>{
        // If true, time cursor will move
        let cursorMode = true;
        
        //showLocation: location of displayed starting point, previous bar*256 + location in bar -1
        let showLocation = 0;
        //pointer: location of time cursor (also a tick)
        let pointer = startingPoint;
        const mainLayerHeight = height/2;

        //4/4 => 60/(BPM/4)s = 1 bar time. 1 bar = 256 tick
        // 1 bar time / 256 = 1 tick time
        // inverse of 1 tick time = fr
        let frameRate = 1/(60/(BPM/4)/256)
        console.log(frameRate);


        p5.setup = function(){
            p5.createCanvas(width, height);
            p5.noStroke();
            p5.frameRate(frameRate);
        }
        p5.draw = function(){
            p5.background(p5.color(colors.back));
            grid()
            layerdrawing(mainLayerHeight, layer);
            timegoes()
        }
        function timegoes(){
            showLocation ++
            if (showLocation>(NumBar)*256){showLocation=0}
        }
        
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
        function timeCursor(pointer){

        }

    }
</script>



<P5 {sketch}/>




