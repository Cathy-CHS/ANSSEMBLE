<script context="module">
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */

    let highlight1, highlight2, highlight3, highlight4

    const key1 = ['1', '2','3','4','5','6','7','8','9','0','-', '='];
    const key2 = ['q','w','e','r','t','y','u','i','o','p','['];
    const key3 = ['a','s','d','f','g','h','j','k','l', ';'];
    const key4 = ['z','x','c','v','b','n','m',',','.'];
    const keyList = key1.concat(key2, key3, key4);
    
    highlight1 = new Array(key1.length).fill(0);
    highlight2 = new Array(key2.length).fill(0);
    highlight3 = new Array(key3.length).fill(0);
    highlight4 = new Array(key4.length).fill(0);
    const aniFrameNum = 30

    export function drawSnare (keys, p5) {
        const width_ratio = p5.width/2000;
        const height_ratio = p5.height/1200;
        const Xoffset = width_ratio*140;
        const Yoffset = width_ratio*150;


        if (keys.length>=1){
            for (let key of keys){
            if (key1.includes(key)){
                highlight1[key1.indexOf(key)] = aniFrameNum;
            }
            if (key2.includes(key)){
                highlight2[key2.indexOf(key)] = aniFrameNum;
            }
            if (key3.includes(key)){
                highlight3[key3.indexOf(key)] = aniFrameNum;
            }
            if (key4.includes(key)){
                highlight4[key4.indexOf(key)] = aniFrameNum;
            }
        }
        }

        p5.translate(Xoffset, Yoffset);
        /////////
        p5.fill(0);
        p5.stroke('#fade96');
        p5.strokeWeight(width_ratio*5);
        const ButtonHeight = 85;
        const ButtonWidth = 95;
        const ButtonDist = ButtonHeight

        let buttonX, buttonY
        for (let i = 0; i<key2.length; i++){
            buttonX=width_ratio*702+width_ratio*ButtonWidth*i
            buttonY=height_ratio*(400+ButtonDist*2)
            if(highlight2[i]>0){
                p5.noFill()
                p5.ellipse(buttonX+width_ratio*ButtonWidth/2, buttonY+height_ratio*ButtonHeight/2, (highlight2[i])*(highlight2[i])/aniFrameNum*ButtonWidth/50)
                highlight2[i] = highlight2[i] -1
            }
            p5.fill(highlightTile(highlight2[i]));
            p5.rect(buttonX,buttonY,width_ratio*ButtonWidth,height_ratio*ButtonHeight, width_ratio*10);
        }
        
        for (let i = 0; i<key4.length; i++){
            buttonX=width_ratio*791+width_ratio*ButtonWidth*i
            buttonY=height_ratio*(400+ButtonDist*4)
            if(highlight4[i]>0){
                p5.noFill()
                p5.ellipse(buttonX+width_ratio*ButtonWidth/2, buttonY+height_ratio*ButtonHeight/2, (highlight4[i])*(highlight4[i])/aniFrameNum*ButtonWidth/50)
                highlight4[i] = highlight4[i] -1
            }
            p5.fill(highlightTile(highlight4[i]));
            p5.rect(buttonX,buttonY,width_ratio*ButtonWidth,height_ratio*ButtonHeight, width_ratio*10);
            

        }
        
        for (let i = -1; i<key1.length-1; i++){
            buttonX=width_ratio*746.5+width_ratio*ButtonWidth*i
            buttonY=height_ratio*(400+ButtonDist*1)
            if(highlight1[i]>0){
                p5.noFill()
                p5.ellipse(buttonX+width_ratio*ButtonWidth/2, buttonY+height_ratio*ButtonHeight/2, (highlight1[i])*(highlight1[i])/aniFrameNum*ButtonWidth/50)
                highlight1[i] = highlight1[i] -1
            }
            p5.fill(highlightTile(highlight1[i]));
            p5.rect(buttonX,buttonY,width_ratio*ButtonWidth,height_ratio*ButtonHeight, width_ratio*10);
        }
        
        for (let i = 0; i<key3.length; i++){
            buttonX=width_ratio*746.5+width_ratio*ButtonWidth*i
            buttonY=height_ratio*(400+ButtonDist*3)
            if(highlight3[i]>0){
                p5.noFill()
                p5.ellipse(buttonX+width_ratio*ButtonWidth/2, buttonY+height_ratio*ButtonHeight/2, (highlight3[i])*(highlight3[i])/aniFrameNum*ButtonWidth/50)
                highlight3[i] = highlight3[i] -1
            }
            p5.fill(highlightTile(highlight3[i]));
            p5.rect(buttonX,buttonY,width_ratio*ButtonWidth,height_ratio*ButtonHeight, width_ratio*10);
        }
        p5.translate(-Xoffset, -Yoffset);

        function highlightTile(indicator) {
            if (indicator>=aniFrameNum-1) return '#fade96';
            else return p5.color(200, 10);
        };
    };

    function playSnare (keys) {
        let useableKeys = []
        //console.log(keys);
        for (let key of keys){
            if (key1.includes(key)){
                useableKeys.push(key) ;
            }
            if (key2.includes(key)){
                useableKeys.push(key);
            }
            if (key3.includes(key)){
                useableKeys.push(key);
            }
            if (key4.includes(key)){
                useableKeys.push(key);
            }
        } 
        
        // export as [ [key, pitch], ...]
        if (useableKeys.length>=1){
            return useableKeys
        } else return [];
        
    };

    // [ [key, layerIndex], ... ]
    let existingKeys = []
    export function keyboardHandlerSnare(p5, layer, absoluteTick){
        let tempKeys = []
        //holding keys, include useless things
        for (let k of Object.keys(p5.kb)){
            if (p5.kb[k]) tempKeys.push(k);
        }
        
        //[ [key, pitch], ...]
        let useableKeys = playSnare (tempKeys)
        //console.log(useableKeys)
        drawSnare(tempKeys, p5);
        if (!(useableKeys.length)) {
            existingKeys = []
        }


        existingKeys = existingKeys.filter((value, index, arr) =>{
            if (useableKeys.includes(value[0])){
                //console.log(useableKeys)
                return value
            }
        })
        // console.log(existingKeys);
        let amp =30; 
        for (let key of useableKeys){
            if (!(existingKeys.includes(key))){
                console.log(key , existingKeys)
                let starting = absoluteTick
                existingKeys.push(key)
                console.log(existingKeys)
                layer.points.push(
                {
                bar: Math.floor(starting/256)+1,
                start: starting%256,
                amp: amp})
                return amp;
            }
        }

        //let existingPitches = existingKeys.map(function(element) {return keyToPitch[keyList.indexOf(element)]});
        // console.log(existingPitches);
        
        /*
        if (p5.kb.presses('b')) {
           console.log(layer.points)
        }
        */
    }


</script>