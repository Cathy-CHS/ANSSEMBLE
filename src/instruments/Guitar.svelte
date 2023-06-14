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

    export function drawString (p5){
        let width_ratio = p5.width/1920;
        let height_ratio = p5.height/1080;
        p5.noFill();
        p5.stroke('#99E4D3');
        p5.strokeWeight(5);
        
        p5.mousePressed = () =>{
            if ((p5.mouseX >width_ratio*528.6)&&(p5.mouseX <width_ratio*1846)&& (p5.mouseY<height_ratio*(643.4+30))&&(p5.mouseY>height_ratio*(643.4-30))){
            x1 = p5.mouseX;
            y1 = p5.mouseY;
            }
            else {
                x1 = 0;
                y1 = 0;
            }
        }
        p5.mouseReleased = () => {
            x2 = p5.mouseX;
            y2 = p5.mouseY;
            x1 = 0;
            y1= 0;
            pitch = height_ratio*643.4-y2;
            console.log(Math.abs(pitch));
        }

        if (p5.mouseIsPressed){
            p5.beginShape();
                p5.stroke('#99E4D3');
                // p5.noFill();
                p5.strokeWeight(5);
                p5.vertex(width_ratio*528.6, height_ratio*643.4);
                p5.bezierVertex(p5.mouseX, p5.mouseY,p5.mouseX, p5.mouseY, width_ratio*1846,height_ratio*643.4);
                p5.endShape();         
        }

        else if (Math.abs(pitch) > 10){
            if (frame%3 ==0){
                p5.beginShape();
                p5.stroke('#99E4D3');
                p5.strokeWeight(5);
                p5.vertex(width_ratio*528.6, height_ratio*643.4);
                p5.bezierVertex(p5.mouseX, height_ratio*643.4 + pitch,p5.mouseX, height_ratio*643.4 + pitch, width_ratio*1846,height_ratio*643.4);
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
                p5.vertex(width_ratio*528.6, height_ratio*643.4);
                p5.bezierVertex(width_ratio*528.6, height_ratio*643.4,width_ratio*528.6, height_ratio*643, width_ratio*1846,height_ratio*643.4);
                p5.endShape();
        }

        p5.line(width_ratio*528.6, height_ratio*498.4,width_ratio*1846,height_ratio*498.4);
        p5.line(width_ratio*528.6, height_ratio*787.07,width_ratio*1846,height_ratio*787.07);
        p5.line(width_ratio*528.6, height_ratio*931.4,width_ratio*1846,height_ratio*931.4);

        p5.strokeWeight(1);
    }

    let pastKeys = [];
    export function drawPitch (p5){
        let width_ratio = p5.width/1920;
        let height_ratio = p5.height/1080;

        let tempKeys = [];
        for (let k of Object.keys(p5.kb)){
            if (p5.kb[k]) tempKeys.push(k);
        }
        let oldKeys = pastKeys.filter(pitch => !tempKeys.includes(pitch));
        pastKeys = tempKeys;
        
        let pitchwhitekey = ['A','S','D','F','G','H','J','K','L'];
        let pitchblackkey = ['W','E','none','T','Y','U','none','O'];

        if (oldKeys.length>=1){
            for (let key of oldKeys){
                const upkey = key.toUpperCase();
                if (pitchwhitekey.includes(upkey)){
                    if (highlightWhite[pitchwhitekey.indexOf(upkey)]) highlightWhite[pitchwhitekey.indexOf(upkey)]--;
                    else highlightWhite[pitchwhitekey.indexOf(upkey)]++;
                }
                if (pitchblackkey.includes(upkey)){
                    if (highlightBlack[pitchblackkey.indexOf(upkey)]) highlightBlack[pitchblackkey.indexOf(upkey)]--;
                    else highlightBlack[pitchblackkey.indexOf(upkey)]++;
                }
            }
        }

        for (let i = 0; i<pitchwhitekey.length; i++){
            p5.stroke(255);
            p5.fill(highlightTile(highlightWhite[i]));
            p5.rect(width_ratio*112 + width_ratio*31*i,height_ratio*536,width_ratio*31,height_ratio*106);
            p5.rect(width_ratio*112 + width_ratio*31*i,height_ratio*693,width_ratio*31,height_ratio*31);
            p5.noStroke();
            p5.fill(255-highlightTile(highlightWhite[i]));
            p5.text(pitchwhitekey[i],width_ratio*120 + width_ratio*31*i,height_ratio*(685+31));
        }

        for (let i = 0; i<pitchblackkey.length; i++){
            p5.stroke(255);
            p5.fill(highlightTile(highlightBlack[i]));
            if (pitchblackkey[i] !== 'none'){
                p5.rect(width_ratio*127.5 + width_ratio*31*i,height_ratio*536,width_ratio*31,height_ratio*60);
                p5.rect(width_ratio*(112+31/2) + width_ratio*31*i,height_ratio*661,width_ratio*31,height_ratio*31);
                p5.noStroke();
                p5.fill(255-highlightTile(highlightBlack[i]));
                p5.text(pitchblackkey[i],width_ratio*(120+31/2) + width_ratio*31*i,height_ratio*685);
            }
        }

        function highlightTile(indicator) {
            if (indicator) return 255;
            else return 0;
        };
    }

    export function resetPitch(p5) {
        highlightWhite.fill(0);
        highlightBlack.fill(0);
    }


</script>