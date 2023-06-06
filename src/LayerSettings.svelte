<script context="module">

    import { onMount } from 'svelte';

    


    

    export function setupSettings (p5) {

    };


    let inst_description = 
    {
        Piano: 'how to play description \nEx. press keyboard'
    }
    
    export function drawSettings (p5, inst) {
        p5.fill('#f5fafa');
        p5.textFont("pretendard");
        let width_ratio = p5.width/1920;
        let height_ratio = p5.height/1080;
        p5.noStroke();
        p5.textSize(width_ratio*60);
        p5.text(inst,width_ratio*120,height_ratio*204);
        
        p5.textSize(width_ratio*20);
        p5.text(inst_description[inst],width_ratio*120,height_ratio*351);
        
        p5.textSize(width_ratio*20);
        p5.text('pitch',width_ratio*120,height_ratio*474);
        
        p5.textSize(width_ratio*20);
        p5.text('Layer Amp',width_ratio*120,height_ratio*869);
        

    };

    export function playSettings (key) {
    };
</script>