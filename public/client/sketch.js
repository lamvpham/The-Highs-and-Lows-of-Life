// slot wheels
let wheel1, wheel2;
let spinning = false;

// label arrays
let noun = ["You", "I", "We", "They", "You", "I", "We"];
let posEmotions = ["Smile", "Glow", "Thrive", "Please", "Inspire", "Love", "Attract"];
let negEmotions = ["Cry", "Question", "Worry", "Tolerate", "Regret", "Suffer", "Doubt"];
let currentEmotions = [...posEmotions]; // clone posEmotions into currentEmotions

let replacementIndex = 0; // start from the first element to replace
let alreadyReplaced = false;
let spunOnce = false;  // flag to track if wheels have spun at least once
let replacingEmotions = true;

// accessories
let font;
let backgroundImage;
let casinovibes;

// console flag for labels
let displayLabels = false;

// press to play text
let showText = true;
let toggleTime = 0;
let textVisible = true;
let stopTime = null; 


// socket components
const socket = io();

socket.on('key', (data) => {
  print(data);
})

socket.on('Wheel1', (focusedLabel1) => {
  print(focusedLabel1);
})

socket.on('Wheel2', (focusedLabel2) => {
  print(focusedLabel2);
})


// main function - preload
function preload() {
  casinovibes = loadSound("assets/casino.mp3");
  font = loadFont("assets/venite.ttf");
  backgroundImage = loadImage("assets/background.png");
}


// main function - setup
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  // background casino ambience
  casinovibes.setVolume(0.25);
  casinovibes.loop();

  // initializing slot wheels -> the arrays, location, first or second wheel parameters
  wheel1 = new SlotMachineWheel(noun, -65, false);
  wheel2 = new SlotMachineWheel(posEmotions, 65, true);

  // all text in canvas
  textFont(font);
  textAlign(CENTER);
}


// main function - draw
function draw() {
  // background details
  noCursor();
  image(backgroundImage, -width / 2, -height / 2, width, height);
  border(); // drawing the border
  grid(-200, 0, true); // grid lines for left side
  grid(-200, 0, false); // grid lines for right side

  // displaying/updating slot wheels
  wheel1.update();
  wheel1.display();
  wheel2.update();
  wheel2.display();

  // function to replace words on the second wheel once per spin indefinitely: posEmotions <-> negEmotions
  if (!wheel1.spinning && !wheel2.spinning && spunOnce && !alreadyReplaced) {
    replacingWords();
    alreadyReplaced = true; // don't replace more than once per spin
  }

  // reset flags when the wheels start spinning again
  if (wheel1.spinning || wheel2.spinning) {
    spunOnce = true; // to ensure the wheels have spun once before word replacement starts
    alreadyReplaced = false;
  }

  displayFocusedLabels();
  presstoplay();
}


// main function - window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


// main function - spacebar press
function keyPressed() {
  if (keyCode == 32) {
    startSpin();
    showText = false; // when spinning, presstoplay disappears
  }
  socket.emit('key', { keyCode })
}


// taken from p5.js for full screen mode 
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}


// stage 1 - activate wheel spins
function startSpin() {
  // start new spin if both wheels have stopped spinning
  if (!wheel1.spinning && !wheel2.spinning) {
    wheel1.spin();
    // wheel2 spins after 400ms delay
    setTimeout(() => {
      wheel2.spin();
    }, 400);
  }
}


// stage 2 - displaying slots in focus
function displayFocusedLabels() {
  // if both wheels stopped spinning  and labels have not been displayed yet
  if (!wheel1.spinning && !wheel2.spinning && !displayLabels) {
    // accessing wheel index to get the current focused labels
    let focusedLabel1 = wheel1.focusedIndex !== null ? wheel1.labels[wheel1.focusedIndex] : null;
    let focusedLabel2 = wheel2.focusedIndex !== null ? currentEmotions[wheel2.focusedIndex % currentEmotions.length] : null;

    console.log(`Wheel 1 focused label: ${focusedLabel1}`);
    console.log(`Wheel 2 focused label: ${focusedLabel2}`);

    // send label data to server
    socket.emit('Wheel1', { focusedLabel1 });
    socket.emit('Wheel2', { focusedLabel2 });

    displayLabels = true; // no repeated logging until next spin
  }
}


// stage 3 - replacing the words in the currentEmotions array
function replacingWords() {
  if (replacingEmotions) {
    // replace words from negEmotions array
    if (replacementIndex < negEmotions.length) {
      currentEmotions[replacementIndex] = negEmotions[replacementIndex];
      replacementIndex++; // this variable determines which word to replace in the currentEmotions array
    } else {
      // once all replacements are done, switch to replacing with posEmotions
      replacingEmotions = false;
      replacementIndex = 0; // reset index for next replacement cycle
    }
  } 
  // replace words from posEmotions array
  else { 
    if (replacementIndex < posEmotions.length) {
      currentEmotions[replacementIndex] = posEmotions[replacementIndex];
      replacementIndex++;
    } else {
      // once all replacements are done, switch to replacing with posEmotions
      replacingEmotions = true;
      replacementIndex = 0; // reset index for next replacement cycle
    }
  }
  console.log("Current emotions array:", currentEmotions);
}


// aesthetics - drawing glowing border around edge of canvas
function border() {
  // drawing border
  noFill(); 
  stroke(4, 206, 245); 
  strokeWeight(1); 
  rect(-width / 2 + 20, -height / 2 + 20, width - 40, height - 40);

  // glow effect by layering decreasing opacity of border + its colour (since theres no easy way to have a glow in p5)
  for (let i = 0; i < 20; i++) {
    let alphaValue = map(i, 0, 20, 50, 0); // decrease opacity as border move outwards
    stroke(4, 206, 245, alphaValue);
    strokeWeight(4);
    rect(-width / 2 + 20 - i, -height / 2 + 20 - i, width - 40 + 2 * i, height - 40 + 2 * i);
  }
}


// aesthetics - 'press space to spin' blinking text
function presstoplay() {
  // blinking text logic
  if (showText && millis() - toggleTime > 1000) { // every 1s
    textVisible = !textVisible;
    toggleTime = millis();
  }

  // text when visible
  if (textVisible && showText) {
    push(); 
    textSize(32);
    fill(240);
    translate(0, 0, 300); // z-index to be in front of wheels
    text("Press SPACE to spin", 0, 0);
    pop();
  }

  // reset stopTime if wheels start spinning
  if ((wheel1.spinning || wheel2.spinning) && stopTime !== null) {
    stopTime = null;
    showText = false;
  }

  // if wheels stopped -> show text
  if (!wheel1.spinning && !wheel2.spinning && stopTime === null) {
    stopTime = millis(); // setting stopTime when both wheels stop
  }

  // show text after 4s, after spins have stopped
  if (stopTime !== null && millis() - stopTime > 4000) {
    showText = true;
  }
}


// aesthetics - grid lines and arrows to indicate which slots are in selected state for visbility
function grid(xOffset, centerY, isLeft) {
  let arrowSize = 20;
  let gridLength = 10; 
  let extendedLength = 20; 
  let spacing = 38;

  push();
  stroke(4, 206, 245);
  strokeWeight(2);
  fill(4, 206, 245);

  // set x relative to center of canvas
  let x = isLeft ? xOffset : -xOffset;

  // drawing outermost grid lines longer
  let yTop = centerY - 2 * spacing; // position of top line
  let yBottom = centerY + 2 * spacing; // position of bottom line
  line(x, yTop, x + (isLeft ? extendedLength : -extendedLength), yTop);
  line(x, yBottom, x + (isLeft ? extendedLength : -extendedLength), yBottom);

  // drawing inner grid lines
  let yAbove = centerY - spacing; // position above arrow
  let yBelow = centerY + spacing; // position below arrow
  line(x, yAbove, x + (isLeft ? gridLength : -gridLength), yAbove);
  line(x, yBelow, x + (isLeft ? gridLength : -gridLength), yBelow);

  // drawing connecting vertical line on the left side
  if (isLeft) {
    line(x, yTop, x, yBottom);
  } else {
    // draw connecting line on the right side
    let xRight = x + (isLeft ? gridLength : -gridLength + 10);
    line(xRight, yTop, xRight, yBottom);
  }

  // drawing arrow
  let arrowX = isLeft ? x + arrowSize : x - arrowSize;
  line(x, centerY, arrowX, centerY);
  triangle(
    arrowX, centerY,
    arrowX + (isLeft ? -5 : 5), centerY - 5,
    arrowX + (isLeft ? -5 : 5), centerY + 5
  );

  pop();
}