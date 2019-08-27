const HOURHAND = document.querySelector("#hour");
const MINUTEHAND = document.querySelector("#minute");
const SECONDHAND = document.querySelector("#second");

let date = new Date();
console.log(date);
let hours = date.getHours();
let minutes = date.getMinutes();
let minuteCounter = 0;
let seconds = date.getSeconds();
let currWindowWidth = window.innerWidth;
let currWindowHeight = window.innerHeight;
let removeCounter = 0;

// Generate audio
const audioContext = new AudioContext();
const tick = document.querySelector('.tick');
const track1 = audioContext.createMediaElementSource(tick);
track1.connect(audioContext.destination);

const kanna = document.querySelector('.kanna');
const track2 = audioContext.createMediaElementSource(kanna);
track2.connect(audioContext.destination);

const maid = document.querySelector('.maid');
const track3 = audioContext.createMediaElementSource(maid);
track3.connect(audioContext.destination);

const rain = document.querySelector('.rain');
const track4 = audioContext.createMediaElementSource(rain);
track4.connect(audioContext.destination);

// Use smoothfade?
// No truncation in javascript
function runClock(){
  if (currWindowHeight - window.innerHeight != 0 || currWindowWidth - window.innerWidth != 0){
    removeCounter += 1;
    playRain();
    currWindowHeight = window.innerHeight;
    currWindowWidth = window.innerWidth;
  }

  seconds = seconds + 1;

  // Continuously play rain audio
  if (rain.paused){
    rain.play();
  }
  // Mistakes: Don't do minutes = minutes + Math.floor(seconds/60). If you do this, the hands will eventually synchronize into one movement,
  // and eventually, the minute hand will turn so fast that you won't be even able to see it rotate.
  if (seconds % 60 == 0){
    minutes += 1;
    kanna.play();
  }

  if (minutes % 10 == 0){
    maid.play();
  } else if (minutes % 60 == 0){
      hours += 1;
  }

  // Move by a certain number of degrees every time the time increments
  HOURHAND.style.transform = "rotate(" +  hours*(360/12) + "deg)";
  MINUTEHAND.style.transform = "rotate(" + minutes*(360/60) + "deg)";
  SECONDHAND.style.transform = "rotate(" + seconds*(360/60) + "deg)";
}

function playRain(){
  for(i = 0; i < 858; i++){
    if (removeCounter > 0){
        $('#rain' + i).remove();
    }
    
    dropLeft = Math.random() * (window.innerWidth);
    dropTop = Math.random() * (window.innerHeight) - window.innerHeight/2;
    $('.rainGenerator').append("<div class='rain' id='rain" + i + "'></div>");
    $("#rain" + i).css('left', dropLeft);
    $("#rain" + i).css('top', dropTop);
  } // for
}

window.onload = function(){
  playRain();
  var interval = setInterval(runClock, 1000);
};
