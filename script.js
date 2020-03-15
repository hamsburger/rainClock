/* Maybe we should add a slidey bar that allows users to control the speed of rain */

// Note to self: no truncation is allowed in javascript
const HOURHAND = document.querySelector("#hour");
const MINUTEHAND = document.querySelector("#minute");
const SECONDHAND = document.querySelector("#second");

let date = new Date();
let hours = date.getHours();
let minutes = date.getMinutes();
let seconds = date.getSeconds();
let currWindowWidth = window.innerWidth;
let currWindowHeight = window.innerHeight;
let minuteCounter = 0;
let removeCounter = 0; // notifies program to remove rain that goes outside of client window bounds.
let rateOfRain = 2; // 2 is the default value for the rate of rain. Users can feel free to change this value using a slidey bar

/* Create media files that connect to the Web Audio API:
https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API.
This is done so that I can control audio in javascript.
*/
const audioContext = new AudioContext();
const tick = document.querySelector('#tick');
const track1 = audioContext.createMediaElementSource(tick);
track1.connect(audioContext.destination);

const kanna = document.querySelector('#kanna');
const track2 = audioContext.createMediaElementSource(kanna);
track2.connect(audioContext.destination);

const maid = document.querySelector('#maid');
const track3 = audioContext.createMediaElementSource(maid);
track3.connect(audioContext.destination);

const rain = document.querySelector('#rain');
const track4 = audioContext.createMediaElementSource(rain);
track4.connect(audioContext.destination);


/* Function : runClock()
*  Description: Move clock hands according to current time and update bounds of rainfall when
client resizes screen dimensions. */
function runClock(){

  /* Note to self: Although I could use a removeCounter to keep track of when I should redraw the rain to fit within the bounds of
  current client screen, I could've also used window.resize. */
  if (currWindowHeight - window.innerHeight != 0 || currWindowWidth - window.innerWidth != 0){
    removeCounter += 1;
    playRain();
    currWindowHeight = window.innerHeight;
    currWindowWidth = window.innerWidth;
  }

  /******************************************************** CLOCK LOGIC  ******************************************/
  seconds = seconds + 1;
  if (minutes % 60 == 0 && seconds % 60 == 0){
    hours += 1;
  }

  // An anime character squeals every 1 minute.
  if (seconds % 60 == 0){
    minutes += 1;

    if(kanna.paused) kanna.play();
  }


  // Move by a certain number of degrees every time the time increments
  HOURHAND.style.transform = "rotate(" +  hours*(360/12) + "deg)";
  MINUTEHAND.style.transform = "rotate(" + minutes*(360/60) + "deg)";
  SECONDHAND.style.transform = "rotate(" + seconds*(360/60) + "deg)";

  // Continuously play rain audio
  if (rain.paused) {
    rain.play();
  }

  // An anime character squeals every 10 minutes
  if (minutes % 10 == 0){
    if (maid.paused) maid.play();
  } 
  
}

/* Function: playRain
* Description: Removes rain if there is rain outside the bounds of the client screen (or when removeCounter == 1);
* Otherwise, this function simply produces rain within the bounds of the screen, which are represented
by gradient lines (See .rain{} in style.css)
*/

/* Question of the Day: What's the slowest rate of rain I can produce so that
* the rain would immediately regenerate after it finishes its animation loop?

How do I derive a formula for rate of rain wrt to when all the rain stops generating? */
function playRain(){

  for(i = 0; i < 429; i++){
    let timeOfRainfall = Math.random()*(rateOfRain) + 2; // Time of rainfall varies from 1s to 3s
    if (removeCounter > 0){
        $('#rain' + i).remove();
    }

    dropLeft = Math.random() * (window.innerWidth);
    dropTop = Math.random() * (window.innerHeight) - window.innerHeight/4;

    $('#rainGenerator').append("<div class='rain' id='rain" + i + "'></div>");

    $("#rain" + i, "#rainGenerator").css('left', dropLeft);
    $("#rain" + i, "#rainGenerator").css('top', dropTop);
    $("#rain" + i, "#rainGenerator").css('animation', 'rainFall infinite linear ' + timeOfRainfall + 's');
  } // for
}

document.querySelector(".slider").oninput = function() {
  let myMedia = document.getElementById("rain");
  myMedia.volume = this.value/100;
}

window.onload = function(){
  playRain();
  var interval = setInterval(runClock, 1000); // Clock is updated every second
}
