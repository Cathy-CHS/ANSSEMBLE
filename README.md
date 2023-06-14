# ID311_FinalProject
- [ID311\_FinalProject](#id311_finalproject)
- [Structure \& Switching](#structure--switching)
  - [Common feature](#common-feature)
    - [Common characteristic](#common-characteristic)
    - [Time cursor](#time-cursor)
  - [Page switching](#page-switching)
  - [DB page](#db-page)
    - [Functions](#functions)
  - [Project page](#project-page)
    - [Functions](#functions-1)
  - [Layer Page](#layer-page)
    - [Functions](#functions-2)
    - [Instrument interaction](#instrument-interaction)
      - [Base](#base)




Basic structure from [typical SvelteKit project](https://kit.svelte.dev/docs/project-structure)
```
my-project/
├ src/
│ ├ lib/
│ ├ Components/
│ │ ├ Interactions/
│ │ │ └ Guitar.svelte // and more interactions by different instrument...
│ │ ├ [Define basic objects: ex. Project, Layer, Point, ...]
│ │ └ [Component files: ex. button]
│ ├ routes/
│ │ ├ Login.svelte
│ │ ├ Home.svelte
│ │ └ Edit.svelte
│ ├ app.svelte
│ └ main.js
├ assets/
│ └ [your static assets]
├ tests/
│ └ [your tests] // dummy data to test
├ package.json
├ package-lock.json
└ rollup.config.js
```
# Structure & Switching

## Common feature



### Common characteristic

Our project is a kind of play-type loop station creation site. Players can create fun short songs by stacking as many layers of instruments as they want. First of all, the interaction is fun.

It is also possible to interact with others in non-real time, such as watching music made by others, copying it, and modifying it as desired. Player can also share their thoughts briefly through the title and description of the project.

All projects are based on four bars. The default BPM is designated as 60, and can be done about twice as fast. Our project supports about five instruments which consists of two musical instruments (piano, guitar) and three percussion instruments (base, cymbals, and snare). Each instrument has a distinctive interaction.

### Time cursor

User can view the time cursor on all pages except the title. User can freely move back and forth in time by dragging the circle at the top. In particular, percussion instruments can be played normally while stationary, so it also helps target the exact location.

Player can also access the hidden elements above and below by scrolling the mouse.

## Page switching

Basically, in order to use p5Play, the instance of p5.Js was used instead of p5-svelte. However, there is no essential difference between p5-svelte and page switching.

```Javascript
...
const dispatch=createEventDispatcher();
...
function projToTot(){
    dispatch('projToTot')
    dispatch('projectTexts', [project_title, project_description])
    p5.remove()
}
...
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{#if !(toggle.toggleProject)}
<script>console.log('asdfasdf')</script>    
    <ProjectSelect on:project = {projToggle}
    on:projectnum ={projSwitch}
    {width} {height} {database} {projToSee} {NumBar}, {user}/>
{:else if toggle.toggleLayer}
<div transition:fade>
        <Layer 
        on:layerToProject = {layerToggle}
        on:layerDup={layerDuplicate} 
        on:deleteLayer={layerDelete}
        {width} {height} {layers} {layerToSee} {NumBar}/>
    </div>
{:else if dupProjectToggle}
    <div transition:fade>
        <Project on:layer = {layerToggle}
        on:projToTot = {projToggle}
        on:projectTexts = {changeDescs}
        on:layernum ={layerSwitch}
        on:projDup = {dupProjectInside}
        {width} {height} {project} {layerToSee} {NumBar}/>
    </div>
{:else if !(toggle.toggleLayer)}
    <div transition:fade>
        <Project {same as above}>
    </div>
{/if}

```

Basically, switching between pages used a dispatch mechanism. Here, not only the switching of the simple page, but also the data are dispatched to reflect the behavior at a point in time on each page. It was gathered in App.svelte and be processed and resupplied.

Three toggles were used. First of all, there are basic DB-project toggle and project-layer toggle. In addition, there is a toggle that opens when copying a project, as the name suggests, called dupProjectToggle.

The reason for this was the project copy function of the Project page, which was to implement the function of transferring the page to the copied project at the same time as the copy.


## DB page

It is a page that can be accessed immediately after the title, and the main function is to select the project you want.

### Functions
- (Click project part) Toggle project to open pre-listen/ duplicate icon
  - (When toggled) Can play preview
  - (When toggled) Can duplicate project
    - toggled project automatically change
    - add "-Copy" string in title of project if title size not exceed 25-5 char (max size of Title = 25 chars)
  - (Click one more) Enter Project page
- (Top tool bar) Back to title page, BPM changer
- (Low + button) Add new project, with default format

## Project page

Pages assigned to each loop station. You can add the desired layer or proceed with the operation with layer or prooject itself.

### Functions
- (Top tool bar) Back to Database page, BPM changer
- (Top tool bar) Play song, change Amplitude
- (Top tool bar) Duplicate project itself and change page into that duplicated project page
- (Low instrument buttons) Create empty layer with corresponding instrument
- (Title, Description panel) Hover mouse to toggle
  - (When toggled) Can add chars with keyboard
  - (When toggled) Can modify text with Backspace
- (Click each Layer) Enter Layer page



## Layer Page

Interaction with instruments is the main part. 

We intentionally did not include modifying points within a layer because we thought that would be more interesting. (It feels more like one actually playing an instrument. And it was a view to focus on experiencing rather than making pretty music.)
Above all, this approach was possible because the maximum was 16 seconds in only four bars.

### Functions
- (Top tool bar) Back to Project page, BPM changer
- (Top tool bar) Play song, change Amplitude
- (Top tool bar) Duplicate layer itself
- (Low Left button) Can delete layer
- Instrument interaction panel in right-low plane 


### Instrument interaction
#### Base
Base drums usually produce the loudest and dullest sound. Therefore, the task load is quite large in terms of interaction, and instead, the visual effect is large.

Basically, Visual que was used to pull and release like a rubber band. First of all, if one hold the mouse, it draws a circle (meaning maximum) that can guess the intensity of playing the instrument, and drag it to make the line connected and the circle inside grow larger. And when user let it go, user get a point on the layer with a poping visual feedback.

