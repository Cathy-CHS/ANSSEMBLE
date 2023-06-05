<script context="module">
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */

    import { onMount } from 'svelte';

    export function setupPiano (p5) {
        let instrument = 'PIANO';
        let instrument_description = 'how to play description \nEx. press keyboard';
        
        // p5.setup = async () => {
        //     p5.createCanvas(p5.windowWidth, p5.windowWidth/1920*1080);
        // };
        // return;
    };

    export function drawPiano (p5) {
        let instrument = 'PIANO';
        let instrument_description = 'how to play description \nEx. press keyboard';

        let width_ratio = p5.width/1920;
        let height_ratio = p5.height/1080;
        let key1 = ['2','3','none','5','6','7','none','9','0','none', '='];
        let key1ToPitch = ['C#3','D#3',null,'F#3','G#3','A#3',null,'C#4','D#4',null,'F#4'];
        let key2 = ['q','w','e','r','t','y','u','i','o','p','[',']'];
        let key2ToPitch = ['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4'];
        let key3 = ['a','s','none','f','g','none','j','k','l'];
        let key3ToPitch = ['G#4','A#4',null,'C#5','D#5',null,'F#5','G#5','A#5'];
        let key4 = ['z','x','c','v','b','n','m',',','.','/'];
        let key4ToPitch = ['A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
        
        // p5.background(0);
        p5.fill(255);
        /////////
        
        p5.noStroke();
        p5.textSize(width_ratio*48);
        p5.text(instrument,width_ratio*120,height_ratio*204);
        
        p5.textSize(width_ratio*20);
        p5.text(instrument_description,width_ratio*120,height_ratio*351);
        
        p5.textSize(width_ratio*20);
        p5.text('pitch',width_ratio*120,height_ratio*474);
        
        p5.textSize(width_ratio*20);
        p5.text('Layer Amp',width_ratio*120,height_ratio*869);
        
        p5.fill(0);
        p5.stroke('#93c7f1');
        p5.strokeWeight(width_ratio*5)
        for (let i = 0; i<12; i++){
            p5.fill(0);
            p5.rect(width_ratio*702+width_ratio*89*i,height_ratio*412.5,width_ratio*89,height_ratio*248.5);
            if (key2.includes(p5.key)){
                p5.fill('#93c7f1');
                p5.rect(width_ratio*702+width_ratio*89*key2.indexOf(p5.key),height_ratio*412.5,width_ratio*89,height_ratio*248.5);
            }
        }
        
        for (let i = 0; i<10; i++){
        p5.fill(0);
        p5.rect(width_ratio*791+width_ratio*89*i,height_ratio*684.5,width_ratio*89,height_ratio*248.5);
        if (key4.includes(p5.key)){
            p5.fill('#93c7f1');
            p5.rect(width_ratio*791+width_ratio*89*key4.indexOf(p5.key),height_ratio*684.5,width_ratio*89,height_ratio*248.5);
        }
        }
        
        for (let i = 0; i<11; i++){
        p5.fill(0);
        if ((i !== 2) && (i !== 6) && (i !== 9)){
        p5.rect(width_ratio*746.5+width_ratio*89*i,height_ratio*412.5,width_ratio*89,height_ratio*149.5);
        }
        if (key1.includes(p5.key)){
            p5.fill('#93c7f1');
            p5.rect(width_ratio*746.5+width_ratio*89*key1.indexOf(p5.key),height_ratio*412.5,width_ratio*89,height_ratio*149.5);
        }
        }
        
        for (let i = 0; i<9; i++){
            p5.fill(0);
            if ((i !== 2) && (i !== 5) && (i !== 9)){
            p5.rect(width_ratio*746.5+width_ratio*89*i,height_ratio*684.5,width_ratio*89,height_ratio*149.5);
            }
            if (key3.includes(p5.key)){
                p5.fill('#93c7f1');
                p5.rect(width_ratio*746.5+width_ratio*89*key3.indexOf(p5.key),height_ratio*684.5,width_ratio*89,height_ratio*149.5);
            }
        
        }
        
        // console.log(p5.key);
    };

    // let sketchId;
    // onMount(function () {
    //     let pianop51 = new p5(setupPiano, sketchId);
    //     let pianop52 = new p5(drawPiano, sketchId);
    // })
</script>

<!-- <div {sketchId} /> -->
