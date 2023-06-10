<script context="module">
    
    export let width = window.innerWidth*0.98;
    export let height = window.innerWidth/1920*905;
    export  const numBarShow = 3;
    export const BPMorigin = 60;
    export const MasterVolOrigin = 1;
    export const startingPoint = width/2.5
    export const text_start = width/16
    export const text_end = startingPoint*0.63
    export const layerWidth = width-startingPoint;
    export const lineWidth = height/700;
    export const layerInstLineWidth = height/15
    export const maxAmpRadius = height/8
    //in Project page
    export const HeightBetLayer = height/7
    export const colors ={
        back: '#030309',
        default: '#f5fafa',
        blue: '#9395f1',
        green: '#99e4d3',
        purple: '#bd9af0',
        pink: '#f293c7',
        yellow: '#fade96'
    }

</script>