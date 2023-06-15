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

        let ellipse1 = [p5.windowWidth/2000*300,p5.windowWidth/2000*300,p5.windowWidth/2000*300*3,p5.random(5),p5.random(5)];
        let ellipse2 = [p5.windowWidth/2000*800,p5.windowWidth/2000*800,p5.windowWidth/2000*250*3,p5.random(5),p5.random(5)];
        let ellipse3 = [p5.windowWidth/2000*1500,p5.windowWidth/2000*850,p5.windowWidth/2000*270*3,p5.random(5),p5.random(5)];
        let ellipse4 = [p5.windowWidth/2000*300,p5.windowWidth/2000*1000,p5.windowWidth/2000*200*3,p5.random(5),p5.random(5)];
        let ellipse5 = [p5.windowWidth/2000*180,p5.windowWidth/2000*500,p5.windowWidth/2000*240*3,p5.random(5),p5.random(5)];
        let ellipse6 = [p5.windowWidth/2000*1600,p5.windowWidth/2000*200,p5.windowWidth/2000*200*3,p5.random(5),p5.random(5)];

        p5.setup = () => {
            p5.createCanvas(width, height);
            input = p5.createInput('Your nickname');
            input.position(p5.width/2-width/2000*300, p5.height/2);
            input.size(width/2000*(300*2+80))
            input.style('font-size', 40*p5.width/2000+'px');
            let button = makeButton();
        };

        p5.draw = () => {
            let width_ratio = p5.width/2000;
            
            p5.background(0);
            p5.fill(255);
            p5.textAlign(p5.CENTER);
            p5.textFont('Pretendard Black');
            p5.textSize(width_ratio*150);
            p5.text('ANSSEMBLE',p5.width/2,p5.height/2-width_ratio*100);
            p5.noStroke(255);
            p5.textSize(width_ratio*50);
            p5.fill(153,228,211,200);

            p5.blendMode(p5.HARD_LIGHT)
            p5.fill(250,222,150,180);
            makeellipse(ellipse1);
            p5.fill(242,147,199,180);
            makeellipse(ellipse2);
            p5.fill(153,228,211,180);
            makeellipse(ellipse3);
            p5.fill(255,255,255,180);
            makeellipse(ellipse4);
            p5.fill(110,44,255,180);
            makeellipse(ellipse5);
            p5.fill(160,239,146,180);
            makeellipse(ellipse6);
            p5.fill(255);
            p5.textSize(width_ratio*150);
            
            p5.text('ANSSEMBLE',p5.width/2,p5.height/2-width_ratio*100);
            p5.textAlign(p5.RIGHT);
            p5.blendMode(p5.BLEND)
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
            p5.ellipse(x, y, r*2, r*2);
            ellipse[0] += ellipse[3]*0.1;
            ellipse[1] += ellipse[4]*0.1;
            if (ellipse[0] > p5.width || ellipse[0] < 0) {
                ellipse[3] = -ellipse[3];
            }
            if (ellipse[1] > p5.height || ellipse[1] < 0) {
                ellipse[4] = -ellipse[4];
            }
        }

        let highToolY = height/13
        const buttonDia = width/20
        function makeButton(){
            let button = new p5.Sprite(p5.width/2, p5.height*0.65, buttonDia, buttonDia, 'kinematic');
            button.draw = () =>{
                
                p5.fill(20);
                p5.ellipse(0, 0, buttonDia, buttonDia);
                p5.fill(255);
                p5.textAlign(p5.CENTER, p5.CENTER);
                p5.textSize(buttonDia / 3);
                p5.text('ENTER', 0, 0)
                if(button.mouse.presses()){
                    enter();
                }
                if(button.mouse.hovering()){
                    p5.fill('rgba(150, 150, 150, 0.25)');
                    p5.ellipse(0, 0, buttonDia, buttonDia);
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