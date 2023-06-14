<script context="module">

    import {colors, lineWidth, maxAmpRadius,startingPoint, HeightBetLayer} from '../Constants.svelte';
    let newStart = 0;
    let tempXY = [0, 0]
    let amplitude
    let radi
    let tempRadi = 0;
    
    let velMat = new Array(5).fill(0);


    function nowVel(){
        return velMat.reduce((acc, cur) => acc + cur, 0)/velMat.length
    }
    let velTemp
    let hitPointX;
    export function mouseHandlerCymbal (p5, layer, absoluteTick, interactionTile) {
        const lineHeight = p5.height - HeightBetLayer*0.5
        const layerColor = p5.color(colors.pink);
        
        let amp = 0;
        p5.strokeCap(p5.ROUND)
        p5.strokeWeight(lineWidth*5)
        p5.stroke(layerColor);
        p5.line(startingPoint, lineHeight, p5.width, lineHeight)
        p5.strokeWeight(lineWidth)

        newStart = absoluteTick; 
        velTemp = 0;

        
        if (interactionTile.mouse.presses()) {
            tempXY = [p5.mouseX, p5.mouseY];
        }
        else if (interactionTile.mouse.pressing()) {
            let maxRadi = maxAmpRadius*2
            velTemp = Math.sqrt(Math.pow((p5.mouse.x-tempXY[0]), 2)+Math.pow((p5.mouse.y-tempXY[1]), 2))
            console.log(nowVel())

            radi = nowVel()*6
            radi = (radi>=maxRadi? maxRadi: radi);
            p5.ellipse(tempXY[0], tempXY[1], lineWidth*40);
            p5.ellipse(tempXY[0], tempXY[1], radi*2);
            p5.noFill()
            p5.stroke(layerColor);
            p5.strokeWeight(lineWidth*2)
            p5.ellipse(tempXY[0], tempXY[1], maxRadi*2);
            

            if (tempXY[1]<=lineHeight && p5.mouseY>=lineHeight){
                hitPointX = p5.mouseX
                amplitude = Math.floor(Math.pow(radi, 1.5)/Math.pow(maxRadi, 1.5)*100);
                tempRadi = radi*3;
                if (amplitude>5) layer.points.push(
                                {amp: amplitude, 
                                bar: Math.floor(newStart/256)+1,
                                start: newStart%256+1,})
                amp = amplitude/100;
            }

            tempXY = [p5.mouseX, p5.mouseY];
        }
   
        if(tempRadi > 5){
            layerColor.setAlpha(100)
            p5.fill(layerColor)
            tempRadi = tempRadi*0.9;
            p5.ellipse(hitPointX, lineHeight, tempRadi*2);
        } else tempRadi = 0;
        velMat.pop();
        velMat.unshift(velTemp)
        return amp;
    };

</script>