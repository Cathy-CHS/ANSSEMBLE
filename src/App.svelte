<script>
    import P5 from 'p5-svelte';
   
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */
    const sketch = (p5) => {
      let instrument = 'PIANO';
      let instrument_description = 'how to play description \nEx. press keyboard';
       
      p5.setup = () => {
       p5.createCanvas(p5.windowWidth, p5.windowWidth/1920*1080);
      };
   
      p5.draw = () => {
       let width_ratio = p5.width/1920;
       let height_ratio = p5.height/1080;
       let key1 = ['2','3','none','5','6','7','none','9','0','none','='];
       let key2 = ['q','w','e','r','t','y','u','i','o','p','[',']'];
       let key3 = ['a','s','d','none','g','h','none','k','l',';'];
       let key4 = ['z','x','c','v','b','n','m',',','.','/'];
       p5.background(0);
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
 
       for (let i = 0; i<10; i++){
       p5.fill(0);
       if ((i !== 3) && (i !== 6)){
       p5.rect(width_ratio*746.5+width_ratio*89*i,height_ratio*684.5,width_ratio*89,height_ratio*149.5);
       }
       if (key3.includes(p5.key)){
          p5.fill('#93c7f1');
          p5.rect(width_ratio*746.5+width_ratio*89*key3.indexOf(p5.key),height_ratio*684.5,width_ratio*89,height_ratio*149.5);
       }
 
       }
 
       console.log(p5.key);
 
 
 
 
 
      };
    };
   </script>
   
   <P5 {sketch} />
 