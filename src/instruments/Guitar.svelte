<script context="module">
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */

    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    let pitch = 0;
    let frame = 0;
    let highlightWhite = new Array(9).fill(0);
    let highlightBlack = new Array(8).fill(0);
    
    export function mouseHandlerGuitar (p5, layer, absoluteTick, pitches, interactionTile){
        let amp = 0;
        let width_ratio = p5.width/2000;
        let height_ratio = p5.height/1200;
        const Xoffset = width_ratio*100;
        const Yoffset = width_ratio*100;

        p5.translate(Xoffset, Yoffset);

        p5.noFill();
        p5.stroke('#99E4D3');
        p5.strokeWeight(2);
        
        if (interactionTile.mouse.presses()) {
            if ((p5.mouseX >width_ratio*750)&&(p5.mouseX <width_ratio*1800)&& (p5.mouseY<height_ratio*(650+30))&&(p5.mouseY>height_ratio*(650-30))){
            x1 = p5.mouseX;
            y1 = p5.mouseY;
            }
            else {
                x1 = 0;
                y1 = 0;
            }
        }

        else if (interactionTile.mouse.pressing()) {
            p5.beginShape();
            p5.stroke('#99E4D3');
            // p5.noFill();
            p5.strokeWeight(2);
            p5.vertex(width_ratio*750, height_ratio*650);
            p5.bezierVertex(p5.mouseX, p5.mouseY,p5.mouseX, p5.mouseY, width_ratio*1800,height_ratio*650);
            p5.endShape();         
        }

        else if (interactionTile.mouse.released()) {
            x2 = p5.mouseX;
            y2 = p5.mouseY;
            x1 = 0;
            y1= 0;
            pitch = height_ratio*650-y2;
            console.log(Math.abs(pitch));
            amp = Number.parseFloat(Math.abs(height_ratio*650-y2)*0.005).toFixed(2);
            if (amp > 1) amp = 1;
            // console.log(amp);
            if (!layer.points) layer.points = [];
            if (pitches != []){
                for (let pitch of pitches) {
                    layer.points.push(
                                    {pitch: pitch,
                                    amp: amp*100, 
                                    bar: Math.floor(absoluteTick/256)+1,
                                    start: absoluteTick%256+1})
                }
            }
        }

        if (Math.abs(pitch) > 10){
            if (frame%3 ==0){
                p5.beginShape();
                p5.stroke('#99E4D3');
                p5.strokeWeight(2);
                p5.vertex(width_ratio*750, height_ratio*650);
                p5.bezierVertex(p5.mouseX, height_ratio*650 + pitch,p5.mouseX, height_ratio*650 + pitch, width_ratio*1800,height_ratio*650);
                p5.endShape();
            }
            frame += 1;
            pitch = -(pitch/1.08);
            if (Math.abs(pitch) < 10){
                pitch = 0;
            }
        }

        else if ((x1==0) || pitch == 0){
            p5.beginShape();
            p5.vertex(width_ratio*750, height_ratio*650);
            p5.bezierVertex(width_ratio*750, height_ratio*650,width_ratio*750, height_ratio*643, width_ratio*1800,height_ratio*650);
            p5.endShape();
        }

        p5.line(width_ratio*750, height_ratio*520, width_ratio*1800, height_ratio*520);
        p5.line(width_ratio*750, height_ratio*780, width_ratio*1800, height_ratio*780);
        p5.line(width_ratio*750, height_ratio*910, width_ratio*1800, height_ratio*910);

        p5.translate(-Xoffset, -Yoffset);
        p5.strokeWeight(1);

        return amp;
    }

    let pastKeys = [];
    export function keyboardHandlerGuitar (p5){
        let width_ratio = p5.width/2000;
        let height_ratio = p5.height/1200;
        const Xoffset = width_ratio*60;
        const Yoffset = width_ratio*100;

        p5.translate(Xoffset, Yoffset);
        
        let tempKeys = [];
        for (let k of Object.keys(p5.kb)){
            if (p5.kb[k]) tempKeys.push(k);
        }
        let oldKeys = pastKeys.filter(pitch => !tempKeys.includes(pitch));
        pastKeys = tempKeys;
        
        let pitchwhitekey = ['A','S','D','F','G','H','J','K','L'];
        let pitchblackkey = ['W','E','none','T','Y','U','none','O'];
        let pitchwhite = ['C3','D3','E3','F3','G3','A3','B3','C4','D4'];
        let pitchblack = ['C#3','D#3',null,'F#3','G#3','A#3',null,'C#4'];
        let pitchList = [];

        if (oldKeys.length>=1){
            for (let key of oldKeys){
                const upkey = key.toUpperCase();
                if (pitchwhitekey.includes(upkey)){
                    pitchList.push(pitchwhite[pitchwhitekey.indexOf(upkey)]);
                    if (highlightWhite[pitchwhitekey.indexOf(upkey)]) highlightWhite[pitchwhitekey.indexOf(upkey)]--;
                    else highlightWhite[pitchwhitekey.indexOf(upkey)]++;
                }
                if (pitchblackkey.includes(upkey)){
                    pitchList.push(pitchblack[pitchblackkey.indexOf(upkey)]);
                    if (highlightBlack[pitchblackkey.indexOf(upkey)]) highlightBlack[pitchblackkey.indexOf(upkey)]--;
                    else highlightBlack[pitchblackkey.indexOf(upkey)]++;
                }
            }
        }

        for (let i = 0; i<pitchwhitekey.length; i++){
            if(highlightWhite[i]) pitchList.push(pitchwhite[i]);
            p5.stroke(255);
            p5.strokeWeight(1);
            p5.fill(highlightTile(highlightWhite[i]));
            p5.rect(width_ratio*112 + width_ratio*35*i,height_ratio*536,width_ratio*35,height_ratio*130);
            p5.rect(width_ratio*112 + width_ratio*35*i,height_ratio*745,width_ratio*35,height_ratio*45);
            p5.noStroke();
            p5.fill(255-highlightTile(highlightWhite[i]));
            p5.text(pitchwhitekey[i],width_ratio*122 + width_ratio*35*i,height_ratio*(745+33));
        }

        for (let i = 0; i<pitchblackkey.length; i++){
            if(highlightBlack[i]) pitchList.push(pitchblack[i]);
            p5.stroke(255);
            p5.strokeWeight(1);
            p5.fill(highlightTile(highlightBlack[i]));
            if (pitchblackkey[i] !== 'none'){
                p5.rect(width_ratio*127.5 + width_ratio*35*i,height_ratio*536,width_ratio*35,height_ratio*80);
                p5.rect(width_ratio*(112+35/2) + width_ratio*35*i,height_ratio*700,width_ratio*35,height_ratio*45);
                p5.noStroke();
                p5.fill(255-highlightTile(highlightBlack[i]));
                p5.text(pitchblackkey[i],width_ratio*(122+35/2) + width_ratio*35*i,height_ratio*(700+33));
            }
        }
        
        p5.translate(-Xoffset, -Yoffset);
        return [...new Set(pitchList)]; //remove duplicates

        function highlightTile(indicator) {
            if (indicator) return 255;
            else return 0;
        };
    }

    export function resetPitch(p5) {
        highlightWhite.fill(0);
        highlightBlack.fill(0);
        pastKeys = [];
    }


</script>