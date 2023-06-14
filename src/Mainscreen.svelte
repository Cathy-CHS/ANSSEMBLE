<script>
    import { onMount, createEventDispatcher } from 'svelte';
    /**
    * a peeFive'd 10print algorithm
    * @see {@link https://10print.org/} to learn about it!
    * @param {p5} p5 instance mode
    */

    export let [width, height] = [400, 300];

    const dispatch = createEventDispatcher();
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
            input = p5.createInput('Your nickname');
            input.position(p5.width/2-width/2000*300, p5.height/2);
            input.style('font-size', 40*p5.width/2000+'px');
            let button = makeButton();
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
            if (name == ''){
                p5.fill(255);
                console.log('Please type your name...');
            }
            else {
                p5.fill(255);
                console.log('hello!');
                dispatch('start', false);
                p5.remove();
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

        let highToolY = height/13
        const buttonDia = width/20
        function makeButton(){
            let button = new p5.Sprite(p5.width/2+width/2000*280, p5.height*0.527, 80, 50, 'kinematic');
            button.draw = () =>{
                p5.fill('#bd9af0');
                p5.rect(0, 0, 80, 50);
                p5.fill(255);
                p5.textFont('Pretendard Black');
                p5.textSize(p5.width/2000*30);
                p5.text('LOGIN', -22, 5);
                if(button.mouse.presses()){
                    enter();
                }
                if(button.mouse.hovering()){
                    p5.fill('rgba(80, 80, 80, 0.25)');
                    p5.rect(0, 0, 80, 50);
                }
            }
            return button
        }
    }


    let sketchId;
        onMount(function () {
        let myp5 = new p5(sketch, sketchId);
        });
    
</script>

<div {sketchId} />