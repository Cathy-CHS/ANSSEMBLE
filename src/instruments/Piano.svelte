<script context="module">
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */

    let highlight1, highlight2, highlight3, highlight4

    const key1 = ['2','3','none','5','6','7','none','9','0','none', '='];
    const key1ToPitch = ['C#3','D#3',null,'F#3','G#3','A#3',null,'C#4','D#4',null,'F#4'];
    const key2 = ['q','w','e','r','t','y','u','i','o','p','[',']'];
    const key2ToPitch = ['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4'];
    const key3 = ['a','s','none','f','g','none','j','k','l'];
    const key3ToPitch = ['G#4','A#4',null,'C#5','D#5',null,'F#5','G#5','A#5'];
    const key4 = ['z','x','c','v','b','n','m',',','.','/'];
    const key4ToPitch = ['A4','B4','C5','D5','E5','F5','G5','A5','B5','C6'];
    const keyList = key1.concat(key2, key3, key4);
    const keyToPitch = key1ToPitch.concat(key2ToPitch, key3ToPitch, key4ToPitch);
    
    export function drawPiano (keys, p5) {
        const width_ratio = p5.width/2000;
        const height_ratio = p5.height/1200;
        const Xoffset = width_ratio*150;
        const Yoffset = width_ratio*130;
        highlight1 = new Array(11).fill(0);
        highlight2 = new Array(12).fill(0);
        highlight3 = new Array(9).fill(0);
        highlight4 = new Array(10).fill(0);

        if (keys.length>=1){
            for (let key of keys){
                if (key1.includes(key)){
                    highlight1[key1.indexOf(key)] = 1;
                }
                if (key2.includes(key)){
                    highlight2[key2.indexOf(key)] = 1;
                }
                if (key3.includes(key)){
                    highlight3[key3.indexOf(key)] = 1;
                }
                if (key4.includes(key)){
                    highlight4[key4.indexOf(key)] = 1;
                }
            }
        }

        p5.translate(Xoffset, Yoffset);
        /////////
        p5.fill(0);
        p5.stroke('#93c7f1');
        p5.strokeWeight(width_ratio*5);

        for (let i = 0; i<12; i++){
            p5.fill(highlightTile(highlight2[i]));
            p5.rect(width_ratio*702+width_ratio*89*i,height_ratio*412.5,width_ratio*89,height_ratio*248.5);
        }
        
        for (let i = 0; i<10; i++){
            p5.fill(highlightTile(highlight4[i]));
            p5.rect(width_ratio*791+width_ratio*89*i,height_ratio*684.5,width_ratio*89,height_ratio*248.5);
        }
        
        for (let i = 0; i<11; i++){
            p5.fill(highlightTile(highlight1[i]));
        if ((i !== 2) && (i !== 6) && (i !== 9)){
            p5.rect(width_ratio*746.5+width_ratio*89*i,height_ratio*412.5,width_ratio*89,height_ratio*149.5);
        }
        }
        
        for (let i = 0; i<9; i++){
            p5.fill(highlightTile(highlight3[i]));
            if ((i !== 2) && (i !== 5) && (i !== 9)){
                p5.rect(width_ratio*746.5+width_ratio*89*i,height_ratio*684.5,width_ratio*89,height_ratio*149.5);
            }
        }
        p5.translate(-Xoffset, -Yoffset);

        function highlightTile(indicator) {
            if (indicator) return '#93c7f1';
            else return 0;
        };
    };

    function playPiano (keys) {
        let tempPitch = []
        //console.log(keys);
        for (let key of keys){
            if (key1.includes(key)){
                tempPitch.push([key, key1ToPitch[key1.indexOf(key)]]);
            }
            if (key2.includes(key)){
                tempPitch.push([key,key2ToPitch[key2.indexOf(key)]]);
            }
            if (key3.includes(key)){
                tempPitch.push([key, key3ToPitch[key3.indexOf(key)]]);
            }
            if (key4.includes(key)){
                tempPitch.push([key, key4ToPitch[key4.indexOf(key)]]);
            }
        } 
        
        // export as [ [key, pitch], ...]
        if (tempPitch.length>=1){
            console.log(tempPitch)
            return tempPitch
        } else return [];
        
    };

    // [ [key, layerIndex], ... ]
    let existingKeyPitches = []
    export function keyboardHandlerPiano(p5, layer, absoluteTick){
        let tempKeys = []
        //holding keys, include useless things
        for (let k of Object.keys(p5.kb)){
            if (p5.kb[k]) tempKeys.push(k);
        }
        
        //[ [key, pitch], ...]
        let tempPitch = playPiano (tempKeys)
        drawPiano(tempKeys, p5);
        if (!(tempPitch.length)) {
            existingKeyPitches = []
        }

        existingKeyPitches = existingKeyPitches.filter((value, index, arr) =>{
            if (tempKeys.includes(value[0])){
                return value
            }
        })
        // drawing keys 
        let existingKeys = existingKeyPitches.map(function(element) {return element[0]})
        
        for (let keyPitch of tempPitch){
            if (existingKeys.includes(keyPitch[0])){
                // [key, pointIndex] [1] of point to modify
                let pointIndex = existingKeyPitches[existingKeys.indexOf(keyPitch[0])][1]
                let mPoint =  layer.points[pointIndex]
                mPoint.duration = absoluteTick - ((mPoint.bar-1)*256 +mPoint.start);
            }else{
                let starting = absoluteTick
                if (!layer.points) layer.points = [];
                existingKeyPitches.push([keyPitch[0], layer.points.length])
                console.log([keyPitch[0], layer.points.length])
                layer.points.push(
                {pitch: keyPitch[1], 
                bar: Math.floor(starting/256)+1,
                start: starting%256,
                duration: 1})
            }
        }

        let existingPitches = existingKeys.map(function(element) {return keyToPitch[keyList.indexOf(element)]});
        return existingPitches;
    }


</script>