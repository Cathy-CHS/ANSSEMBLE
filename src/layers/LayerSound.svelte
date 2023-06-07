<script context="module">
    // import piano_Db3 from '$assets/piano/Db3.mp3';

    export function loadSoundtrack(p5, soundObject){
        // soundObject = 
        // console.log(soundObject);
        // soundObject.test = 'test';
        // if (inst == 'piano'){
        soundObject[0].Soundtrack.push(p5.loadSound('assets/piano/C4.mp3'));
        // }
        // else if (inst == 'base'){layerColor =p5.color(colors.purple)}
        // else if (inst == 'trumpet'){layerColor =p5.color(colors.purple)}
        // else if (inst == 'snare'){layerColor =p5.color(colors.yellow)}
        // else if (inst == 'cymbal'){layerColor =p5.color(colors.pink)}
        // else if (inst == 'guitar'){layerColor =p5.color(colors.green)}
    }
</script>