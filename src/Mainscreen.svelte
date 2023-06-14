<script>
    import { onMount, createEventDispatcher } from 'svelte';
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */

    export let [width, height] = [400, 300];

    const sketch = (p5) => {
        let input;
        let gui;
        let button;
        // let namelist = ['KHJ', 'LNH', 'CHS']

        let ellipse1 = [p5.windowWidth/2000*300,p5.windowWidth/2000*300,p5.windowWidth/2000*300,p5.random(5),p5.random(5)];
        let ellipse2 = [p5.windowWidth/2000*800,p5.windowWidth/2000*800,p5.windowWidth/2000*250,p5.random(5),p5.random(5)];
        let ellipse3 = [p5.windowWidth/2000*1500,p5.windowWidth/2000*850,p5.windowWidth/2000*270,p5.random(5),p5.random(5)];
        let ellipse4 = [p5.windowWidth/2000*300,p5.windowWidth/2000*1000,p5.windowWidth/2000*200,p5.random(5),p5.random(5)];
        let ellipse5 = [p5.windowWidth/2000*180,p5.windowWidth/2000*500,p5.windowWidth/2000*240,p5.random(5),p5.random(5)];
        let ellipse6 = [p5.windowWidth/2000*1600,p5.windowWidth/2000*200,p5.windowWidth/2000*200,p5.random(5),p5.random(5)];

        p5.setup = () => {
            // p5.createCanvas(p5.windowWidth, p5.windowWidth/2000*1200);
            p5.createCanvas(width, height);
            input = p5.createInput();
            input.position(p5.width/2-width/2000*300, p5.height/2);
            input.style('font-size', 40*p5.width/2000+'px');
            // gui = p5.createGui();
            // button = p5.createButton("LOGIN");
            // button.position(p5.width/2+p5.windowWidth/2000*200,p5.height/2);
            // button.mousePressed(enter);
            // button.style('font-size', 40*p5.width/2000+'px');
            // button.style('back-ground', p5.color(255,255,255,255));
        };

        p5.draw = () => {
            let width_ratio = p5.width/2000;
            p5.background(0);
            p5.fill(255);
            p5.textFont('Pretendard Black');
            p5.textSize(width_ratio*150);
            p5.text('ANSSEMBLE',p5.width/2-width_ratio*400,p5.height/2-width_ratio*100);
            p5.noStroke(255);
            p5.textSize(width_ratio*50);
            p5.fill(153,228,211,200);
            p5.ellipse(width_ratio*600,width_ratio*400,width_ratio*150);
            p5.fill(147,199,241,200);
            p5.ellipse(width_ratio*1200,width_ratio*500,width_ratio*80);
            p5.fill(242,147,199,200);
            p5.ellipse(width_ratio*1390,width_ratio*350,width_ratio*50);
            p5.fill(250,222,150,200);
            p5.ellipse(width_ratio*1430,width_ratio*380,width_ratio*30);
            p5.fill(250,222,150,150);
            makeellipse(ellipse1);
            p5.fill(242,147,199,150);
            makeellipse(ellipse2);
            p5.fill(153,228,211,150);
            makeellipse(ellipse3);
            p5.fill(255,255,255,150);
            makeellipse(ellipse4);
            p5.fill(110,44,255,150);
            makeellipse(ellipse5);
            p5.fill(160,239,146,150);
            makeellipse(ellipse6);
            p5.fill(255);
            p5.textSize(width_ratio*150);
            p5.text('ANSSEMBLE',p5.width/2-width_ratio*400,p5.height/2-width_ratio*100);
        };
        
        function enter(){
            let width_ratio = p5.width/2000;
            p5.textSize(50);
            var name = input.value();
            console.log(name)
            // 사용자 닉네임 입력
            if (name == ''){
                //입력 안함
                p5.fill(255);
                console.log('Please type your name...');
                p5.text('Please type your name again...',p5.width/2-width_ratio*150,p5.height/2+width_ratio*100);
            }
            // else if (!namelist.includes(name)){
            //     //리스트에 닉네임 없음
            //     p5.fill(255);
            //     console.log('Please check your name again...');
            //     p5.text('Please check your name again...',p5.width/2-width_ratio*400,p5.height/2+width_ratio*100);
            // }
            else {
                p5.fill(255);
                console.log('hello!');
                p5.text('HELLO',p5.width/2-width_ratio*400,p5.height/2+width_ratio*100);
            }
        }

        function makeellipse(ellipse){
            
            let x = ellipse[0];
            let y = ellipse[1];
            let r = ellipse[2];
        
            let xspeed = ellipse[3];
            let yspeed = ellipse[4];
            // console.log(ellipse[0],ellipse[1],ellipse[2],ellipse[3],ellipse[4]);
            p5.ellipse(x, y, r*2, r*2);
            ellipse[0] += ellipse[3];
            ellipse[1] += ellipse[4];
            if (ellipse[0] > p5.width - r || ellipse[0] < r) {
                ellipse[3] = -ellipse[3];
            }
            if (ellipse[1] > p5.height - r || ellipse[1] < r) {
                ellipse[4] = -ellipse[4];
            }
        }
    }


    let sketchId;
        onMount(function () {
        let myp5 = new p5(sketch, sketchId);
        });
    
</script>

<div {sketchId} />