<script>
    import P5 from 'p5-svelte';
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */

const sketch = (p5) => {
    let instrument = 'GUITAR';
    let instrument_description = 'how to play description \nEx. Pull and let go';
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    let curve1 = [0.0];
    let curve2 = [0.0];


    p5.preload = () => {
      //let buttons = p5.loadImage('./../image/buttons.png');
    };

    p5.setup = () => {
     p5.createCanvas(p5.windowWidth, p5.windowWidth/2000*1200);
     
    };


    p5.draw = () => {


     p5.background(0);
     drawbuttons();
     drawtexts();
     drawstring();
     drawpitch ();

    };



   function drawbuttons(){
     let width_ratio = p5.width/1920;
     let height_ratio = p5.height/1080;
     let back_button = [width_ratio*78,height_ratio*93,width_ratio*26,height_ratio*41];
     let add_button = [width_ratio*141,height_ratio*93,width_ratio*51,height_ratio*51];
     let speed_button = [width_ratio*290,height_ratio*93,width_ratio*37,height_ratio*43];
     let play_button = [width_ratio*361,height_ratio*93,width_ratio*32,height_ratio*41];
      p5.stroke('#93c7f1');
      p5.rect(back_button[0],back_button[1],back_button[2],back_button[3]);
      p5.rect(add_button[0],add_button[1],add_button[2],add_button[3]);
      p5.rect(speed_button[0],speed_button[1],speed_button[2],speed_button[3]);
      p5.rect(play_button[0],play_button[1],play_button[2],play_button[3]);

      p5.mousePressed = () => {
       let width_ratio = p5.width/1920;
       let height_ratio = p5.height/1080;
       let mouseX = p5.mouseX;
       let mouseY = p5.mouseY;
       if ((back_button[0]<mouseX)&&(mouseX<back_button[0]+back_button[2])){
          console.log("back_button");
       }
       if ((add_button[0]<mouseX)&&(mouseX<add_button[0]+add_button[2])){
          console.log("add_button");
       }
       if ((speed_button[0]<mouseX)&&(mouseX<speed_button[0]+speed_button[2])){
          console.log("speed_button");
       }
       if ((play_button[0]<mouseX)&&(mouseX<play_button[0]+play_button[2])){
          console.log("play_button");
       }
    }
   }

   function drawtexts(){
     let width_ratio = p5.width/1920;
     let height_ratio = p5.height/1080;
     p5.fill(255);
     p5.noStroke();
     p5.textSize(width_ratio*48);
     p5.text(instrument,120,204);

     p5.textSize(width_ratio*20);
     p5.text(instrument_description,width_ratio*120,height_ratio*351);

     p5.textSize(width_ratio*20);
     p5.text('pitch',width_ratio*120,height_ratio*474);

     p5.textSize(width_ratio*20);
     p5.text('Layer Amp',width_ratio*120,height_ratio*869);
   }



   function drawstring (){
    let width_ratio = p5.width/1920;
    let height_ratio = p5.height/1080;
    p5.noFill();


    p5.stroke('#99E4D3');
    p5.strokeWeight(5);
    if(curve1[0]==0) curve1=[width_ratio*1846,height_ratio*498.4];
    

    p5.mousePressed = () =>{
        x1 = p5.mouseX;
        y1 = p5.mouseY;
    }

    p5.mouseDragged = () => {
        if ( (x1 > width_ratio*582.6) ){
            console.log("aa");
            p5.beginShape();
            p5.stroke('#99E4D3');
            p5.noFill();
            p5.strokeWeight(5);
            p5.vertex(width_ratio*528.6, height_ratio*498.4);
            p5.bezierVertex(p5.mouseX, p5.mouseY,p5.mouseX, p5.mouseY, width_ratio*1846,height_ratio*498.4);
            p5.endShape();         
    }
    }

    p5.mouseReleased = () => {
        x2 = p5.mouseX;
        y2 = p5.mouseY;
        x1 = 0;
        y1= 0;
    }

    if (x1==0){
        p5.beginShape();
            p5.vertex(width_ratio*528.6, height_ratio*498.4);
            p5.bezierVertex(width_ratio*528.6, height_ratio*498.4,width_ratio*528.6, height_ratio*498.4, width_ratio*1846,height_ratio*498.4);
            p5.endShape();
    }




    p5.strokeWeight(1);
   }

   function drawpitch (){
    let width_ratio = p5.width/1920;
    let height_ratio = p5.height/1080;
    
    let keypressed =[];
    let pitchwhitekey = ['A','S','D','F','G','H','J','K','L'];
    let pitchblackkey = ['W','E','none','T','Y','U','none','O'];
    for (let i=0 ; i<100;i++){
        if (p5.keyIsDown(i)){
            if (pitchwhitekey.includes(String.fromCharCode(i))||pitchblackkey.includes(String.fromCharCode(i))){
                keypressed.push(String.fromCharCode(i));
            }
     }
    }


    for (let i = 0; i<pitchwhitekey.length ; i++){
        p5.stroke(255);
        p5.fill(0);
        if (keypressed.includes(pitchwhitekey[i])){
            p5.fill(255);
        }
        p5.rect(width_ratio*112 + width_ratio*31*i,height_ratio*536,width_ratio*31,height_ratio*106);

        p5.rect(width_ratio*112 + width_ratio*31*i,height_ratio*693,width_ratio*31,height_ratio*31);
        p5.noStroke();
        p5.fill(255);
        p5.text(pitchwhitekey[i],width_ratio*120 + width_ratio*31*i,height_ratio*(685+31));
    }

    for (let i = 0; i<pitchblackkey.length ; i++){
        p5.stroke(255);
        p5.fill(0);

        if (keypressed.includes(pitchblackkey[i])){
            p5.fill(255);
        }
        if (pitchblackkey[i] !== 'none'){
        p5.rect(width_ratio*127.5 + width_ratio*31*i,height_ratio*536,width_ratio*31,height_ratio*60);
        p5.rect(width_ratio*(112+31/2) + width_ratio*31*i,height_ratio*661,width_ratio*31,height_ratio*31);
        p5.noStroke();
        p5.fill(255);
        p5.text(pitchblackkey[i],width_ratio*(120+31/2) + width_ratio*31*i,height_ratio*685);
    }
    }


   }
   
};

</script>
<P5 {sketch} />