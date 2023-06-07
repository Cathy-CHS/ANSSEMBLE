<script context="module">

    import { onMount } from 'svelte';
    import {colors, numBarShow, startingPoint, layerWidth, lineWidth} from './Constants.svelte';

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



    



</script>