<script context="module">

    import { onMount } from 'svelte';
    import {colors, lineWidth, maxAmpRadius} from './Constants.svelte';
    let newStart = 0;
    let isDrag = 0;
    let tempXY = [0, 0]
    let amplitude
    let radi
    let tempRadi = 0;

    
    export function mouseHandlerBase (p5, layer, absoluteTick, interactionTile) {
        const layerColor = p5.color(colors.purple)
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
            amplitude = Math.floor(Math.pow(radi, 1.5)/Math.pow(maxRadi, 1.5)*100)
            
        }
        else if (interactionTile.mouse.released()){
            isDrag = 0;
            tempRadi = radi;
            if (amplitude>10) layer.points.push(
                            {amp: amplitude, 
                            bar: Math.floor(newStart/256)+1,
                            start: newStart%256+1,})
        }
        if(tempRadi > 5){
            tempRadi  = tempRadi*0.8;
            p5.ellipse(tempXY[0], tempXY[1], tempRadi*2);
        } else tempRadi = 0;
    };

</script>