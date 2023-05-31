

<script>
    import P5 from "p5-svelte";
    export let [width, height, layer, layers] = [400,300, {}, []];
    
    const colors ={
        back: '#030309',
        object: '#f5fafa',
        blue: '#9395f1',
        green: '#99e4d3',
        purple: '#bd9af0',
        pink: '#f293c7',
        yellow: '#fade96'
    }
    //max number of bar in one display
    const numBarShow = 3;
    const startingPoint = width/3
    const layerWidth = width-startingPoint;
    const lineWidth = height/500;


    const sketch = (p5) =>{
        p5.setup = function(){
            p5.createCanvas(width, height);
            p5.background(p5.color(colors.back));
            p5.strokeWeight(lineWidth);
            p5.noStroke();
            //showLocation: location of displayed starting point, previous bar*256 + location in bar -1
            //pointer: location of time cursor
            let pointer = 0;
        }
        p5.draw = function(){
            layerdrawing(height/2, layer);
        }
        function layerdrawing(yLocation, layer){
            let inst = layer.inst;
            let points = layer.points;
            p5.stroke(p5.color(colors.object));
            p5.line(startingPoint, yLocation, width, yLocation);
            p5.noStroke();
        }

    }
</script>



<P5 {sketch}/>




