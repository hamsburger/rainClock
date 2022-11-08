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
let rateOfRain = 2; // 2 is the default value for the rate of rain.
let instructionStepCounter = -1;

/* Audio files */
const kanna = document.querySelector('#kanna');
const maid = document.querySelector('#maid');
const rain = document.querySelector('#rain');

/* Instruction Elements */
const instructionBox = document.querySelector("#instruction-box");
let stepCounter = document.querySelector("#step-counter");
let instructionContent = document.querySelector("#instruction-box > .content");
const instructionObjs = [{
                          "instruction": "Move the slider on the right of this dialog box to adjust volume",
                          "top" : "2.5%",
                          "right" : "25%"
                        },
                        {
                          "instruction" : "Anime sounds will reverbrate from the clock on minute and hour intervals. " +
                                           "Use this for the advantage of your use case, such as meditation.",
                          "top" : "10%",
                          "left" : "12%"
                        }
                      ];
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const closeButton = document.querySelector("#close-button");

/* Buttons */
const help = document.querySelector("#help");




/* Function : runClock()
*  Description: Move clock hands according to current time and update bounds of rainfall when
client resizes screen dimensi"ons. */
function runClock(){

  /* Note to self: Although I could use a removeCounter to keep track of when I should redraw the rain to fit within the bounds of
  current client screen, I could've also used window.resize. */
  if (currWindowHeight - window.innerHeight != 0 || currWindowWidth - window.innerWidth != 0){
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
  HOURHAND.style.transform = "rotate(" +  (hours*(360/12) + 360/12 * minutes/60)  + "deg)";
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
*  Description: Removes rain if client resizes window
*  Otherwise, this function simply produces rain within the bounds of the screen, which are represented 
*  by gradient lines (See .rain{} in style.css)
*/
function playRain(){

  for(i = 0; i < 350; i++){
    let timeOfRainfall = Math.random()*(rateOfRain) + 1; // Time of rainfall varies from 0s to 3s    
    $('#rain' + i).remove();

    dropLeft = Math.random() * (window.innerWidth);
    dropTop = Math.random() * (window.innerHeight) - window.innerHeight/4;

    $('#rainGenerator').append("<div class='rain' id='rain" + i + "'></div>");

    $("#rain" + i, "#rainGenerator").css('left', dropLeft);
    $("#rain" + i, "#rainGenerator").css('top', dropTop);
    $("#rain" + i, "#rainGenerator").css('animation', 'rainFall infinite linear ' + timeOfRainfall + 's');
  } // for
}


function updateInstructions(index){
  if (instructionObjs[index].right){
    instructionBox.style.right = instructionObjs[index].right;
    instructionBox.style.left = '';
  }
  if (instructionObjs[index].left){
    instructionBox.style.left = instructionObjs[index].left;
    instructionBox.style.right = '';
  }

  instructionBox.style.top = instructionObjs[index].top;
  instructionContent.innerHTML = instructionObjs[index].instruction;
  stepCounter.innerHTML = `Help Dialog ${index + 1} out of 2`;
}

/**
 * Events
 */
help.onclick = function(){
  instructionStepCounter++; // Initialize instructions counter
  instructionBox.setAttribute("style", "display:flex;");
  updateInstructions(instructionStepCounter);
}

prevButton.onclick = function(){
  if (instructionStepCounter > 0){
    instructionStepCounter--
    updateInstructions(instructionStepCounter);
  }
}

nextButton.onclick = function(){
  if (instructionStepCounter < 1){
    instructionStepCounter++;
    updateInstructions(instructionStepCounter);
  }
}

closeButton.onclick = function(){
  instructionStepCounter = -1;
  instructionBox.setAttribute("style", "display:none;");
  stepCounter.innerHTML = '';
  instructionContent.innerHTML = '';
  instructionBox.style.top = '';
  instructionBox.style.left = '';
  instructionBox.style.right = '';
}

document.querySelector(".slider").oninput = function() {
  let myMedia = document.getElementById("rain");
  let selectedVolume = this.value;
  myMedia.volume = selectedVolume/100;


  if (selectedVolume == 0){
    kanna.volume = 0;
    maid.volume = 0;
  } else if (selectedVolume <= 50){
    kanna.volume = 0.5;
    maid.volume = 0.5; 
  } else {
    kanna.volume = 1;
    maid.volume = 1;
  } 
}

window.onload = function(){

  /**
   * Initialize volumes and play rain
   */
  kanna.volume = 0;
  maid.volume = 0;
  rain.volume = 0;
  playRain();
  var interval = setInterval(runClock, 1000); // Clock is updated every second
}
