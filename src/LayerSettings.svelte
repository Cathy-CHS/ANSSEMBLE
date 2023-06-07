<script context="module">

    import { onMount } from 'svelte';
    import { width, height, colors, numBarShow, startingPoint, layerWidth, lineWidth, layerInstLineWidth, maxAmpRadius } from './Constants.svelte';

    export function timeCursorMake(p5, cursorHeight){
        let timeCursor = new p5.Sprite(100, 100, lineWidth*15*2, lineWidth*15*2);
        timeCursor.draw = ()=>{
            p5.strokeCap(p5.ROUND)
            p5.strokeWeight(lineWidth);
            p5.stroke(colors.default);
            p5.fill(colors.default)
            p5.ellipse(0, 0, lineWidth*15*2);
            p5.line(0, -lineWidth*15, 0, cursorHeight- lineWidth*15);
        }
        p5.noStroke();
        return timeCursor
    }
    export function timeCursorMove(p5, timeCursor, pointer, absoluteTick, maxNumBar){
        let X = pointer/(numBarShow*256) * layerWidth + startingPoint;
        timeCursor.pos = {x:X,y: lineWidth*15}
        if (timeCursor.mouse.dragging()) {
            let mouseLocation = p5.mouse.x;
            let relLocation = mouseLocation-X;
            timeCursor.pos.x = Math.max(startingPoint, mouseLocation)// + timeCursor.mouse.x
            absoluteTick = absoluteTick + relLocation/layerWidth*(numBarShow*256) * 0.1
            if (absoluteTick<=0) absoluteTick = 0;
            else if(absoluteTick>=maxNumBar*256) absoluteTick = maxNumBar*256;
        }
        return absoluteTick
    }
    export function timeCursorRemove(timeCursor){
        timeCursor.remove()
    }
            //For element moving

    let showLocation = 0
    function timeToX(bar, start, showLoc = showLocation){
        showLocation =showLoc;
        let tick = (bar-1)*256 +start - showLocation;
        let X = tick/(numBarShow*256) * layerWidth + startingPoint;
        return X;
    }

    export function grid(p5, gridHeight, showLocation){
        p5.strokeCap(p5.ROUND)
        p5.strokeWeight(lineWidth);
        let gridColor = p5.color(colors.default);
        gridColor.setAlpha(50)
        p5.stroke(gridColor);
        for (let i = 0 ; i<=numBarShow; i++){
            let X = timeToX(Math.floor(showLocation/256)+i+1, 0, showLocation);
            if (X>startingPoint){p5.line(X, 0, X, gridHeight);}
        }
    }

    let layerColor
    export function layerColoring(inst, p5){
        
        if (inst == 'piano'){layerColor =p5.color(colors.blue)}
        else if (inst == 'trumpet'){layerColor =p5.color(colors.purple)}
        else if (inst == 'base'){layerColor =p5.color(colors.purple)}
        else if (inst == 'snare'){layerColor =p5.color(colors.yellow)}
        else if (inst == 'cymbal'){layerColor =p5.color(colors.pink)}
        else if (inst == 'guitar'){layerColor =p5.color(colors.green)}
        layerColor.setAlpha(90);
        return layerColor
    }

    export function layerdrawing(p5, yLocation, layer){
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

        layerColor = layerColoring(inst, p5)
        if (inst == 'piano' || inst == 'trumpet'){
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
        } else if (inst == 'base' || inst == 'snare' || inst == 'cymbal' || inst == 'guitar'){
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

</script>