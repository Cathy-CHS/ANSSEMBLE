<script>
    import P5 from 'p5-svelte';
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */

const sketch = (p5) => {
    let input;
    let input2;
    let button;
    let button2;


    p5.setup = () => {

    p5.createCanvas(p5.windowWidth, p5.windowWidth/2000*1200);
    input = p5.createInput();
    input.position(p5.width/2-p5.windowWidth/2000*300, p5.height/2);
    input.style('font-size', 40*p5.width/2000+'px');
    button = p5.createButton("LOGIN");
    button.position(p5.width/2+p5.windowWidth/2000*200,p5.height/2);
    button.mousePressed(enter);
    button.style('font-size', 40*p5.width/2000+'px');
    };


    p5.draw = () => {
     let width_ratio = p5.width/2000;
     let height_ratio = p5.height/1200;
     p5.background(0);
     p5.fill(255);
     p5.textSize(width_ratio*150);
     p5.text('ID311',p5.width/2-width_ratio*200,p5.height/2-width_ratio*100);
     p5.noStroke();
     p5.textSize(width_ratio*50);
    };

    function enter(){
        p5.textSize(30);
        var name = input.value();
        console.log(name)
// 사용자 닉네임 입력

        input2 = p5.createInput();
        input2.position(p5.width/2-p5.windowWidth/2000*300, p5.height/2);
        input2.style('font-size', 40*p5.width/2000+'px');


        button2 = p5.createButton("ENTER");
        button2.position(p5.width/2+p5.windowWidth/2000*200,p5.height/2);
        button2.mousePressed(enter2);
        button2.style('font-size', 40*p5.width/2000+'px');
    }

    function enter2(){
    //// 노래 검색
        p5.textSize(30);
        var name = input2.value();
        console.log(name)
    }
   
};

</script>
<P5 {sketch} />