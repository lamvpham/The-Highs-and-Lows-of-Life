// slot wheels
let wheel1, wheel2;
let spinning = false;
let groups = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];
let cheers = ["1", "2", "3", "4", "5", "6", "7"];

// accessories
let font;
let backgroundImg;
let casinovibes;

// console flag for labels
let displayLabels = false;

// press to play text
let showText = true;
let lastToggleTime = 0;
let textVisible = true;
let stopTime = null; 

// socket components
// console.log('Here!!!');
// const socket = io('http://127.0.0.1:5500/', {
//   transports: ['websocket'],
//   cors: {
//     origin: 'http://127.0.0.1:5500/public/client/index.html'
//   }
// });

let socket = io.connect('http://127.0.0.1:5500/');
console.log(socket);

socket.on('connection', () => {
  console.log('Connect to the server');
});

socket.on('key', (data) => {
  console.log(data);
});

socket.on('Wheel1', (focusedLabel1) => {
  console.log(focusedLabel1);
});

socket.on('Wheel2', (focusedLabel2) => {
  console.log(focusedLabel2);
});




// main function - preload
function preload() {
  // slotClick = loadSound("assets/click.mp3");
  casinovibes = loadSound("assets/casino.mp3");
  // win = loadSound("assets/win.mp3");
  font = loadFont("assets/venite.ttf");
  backgroundImg = loadImage("assets/background.png");
}


// main function - setup
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  // background casino ambience
  casinovibes.setVolume(0.25);
  casinovibes.loop();

  wheel1 = new SlotMachineWheel(groups, -60);
  wheel2 = new SlotMachineWheel(cheers, 60);

  textFont(font);
  textAlign(CENTER);
  textSize(24);
}


// main function - draw
function draw() {
  // background details
  background(10);
  imageMode(CORNER);
  image(backgroundImg, -width / 2, -height / 2, width, height);
  border();

  // grid lines
  drawGridAndArrow(-200, 0, true); 
  drawGridAndArrow(-200, 0, false); 

  // displaying slot wheels
  wheel1.update();
  wheel1.display();
  wheel2.update();
  wheel2.display();

  displayFocusedLabels()
  // displaying 'press space to spin'
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




// activate wheel spins
function startSpin() {
  // Only start a new spin if both wheels have stopped spinning
  if (!wheel1.spinning && !wheel2.spinning) {
    wheel1.spin();
    // Start wheel2 spinning after a delay of 400 ms
    setTimeout(() => {
      wheel2.spin();
    }, 400);
  }
}


function displayFocusedLabels() {
  if (!wheel1.spinning && !wheel2.spinning && !displayLabels) {
      let focusedLabel1 = wheel1.labels[wheel1.focusedIndex];
      let focusedLabel2 = wheel2.labels[wheel2.focusedIndex];
      
      console.log(`Wheel1: ${focusedLabel1}`);
      console.log(`Wheel2: ${focusedLabel2}`);

      socket.emit('Wheel1', { focusedLabel1 })
      socket.emit('Wheel2', { focusedLabel2 })

      // Set the flag to prevent further logging until reset
      displayLabels = true;
  }
}




// drawing glowing border around edge of canvas
function border() {
  // Draw the border
  noFill(); // Ensure the rectangle isn't filled
  stroke(4, 206, 245); // Set the stroke color for the border (white in this case)
  strokeWeight(4); // Set the stroke weight (border thickness)

  // Glow effect for the border
  noFill();
  for (let i = 0; i < 20; i++) { // Increase 'i' for more intense glow
    let alphaValue = map(i, 0, 20, 50, 0); // Decrease opacity as we move outwards
    stroke(4, 206, 245, alphaValue);
    strokeWeight(4);
    rect(-width / 2 + 20 - i, -height / 2 + 20 - i, width - 40 + 2 * i, height - 40 + 2 * i);
  }

  // Main border
  noFill();
  stroke(4, 206, 245);
  strokeWeight(4);
  rect(-width / 2 + 20, -height / 2 + 20, width - 40, height - 40);
}


// 'press space to spin' blinking text
function presstoplay() {
  // Blinking text logic
  if (showText && millis() - lastToggleTime > 1000) { // Toggle every 1 second
    textVisible = !textVisible;
    lastToggleTime = millis();
  }

  // Draw text if it's supposed to be visible
  if (textVisible && showText) {
    push(); // Save the current transformation state
    textSize(32);
    fill(240);
    noStroke();
    translate(0, 0, 300); // Move text in front of other elements
    text("Press SPACE to spin", 0, 0);
    pop(); // Restore the transformation state
  }

  // Check if wheels have stopped to determine whether to show text
  if (!wheel1.spinning && !wheel2.spinning && stopTime === null) {
    stopTime = millis(); // Set stopTime when both wheels stop
  }

  // Reset stopTime if either wheel starts spinning
  if ((wheel1.spinning || wheel2.spinning) && stopTime !== null) {
    stopTime = null;
    showText = false; // Hide text when wheels start spinning
  }

  // Show text after 4 seconds if stopTime is set
  if (stopTime !== null && millis() - stopTime > 4000) {
    showText = true;
  }
}


// grid lines and arrows to indicate which slots are in selected state for visbility
function drawGridAndArrow(xOffset, centerY, isLeft) {
  let arrowSize = 20; // Size of the arrow
  let gridLength = 10; // Length of the grid lines
  let extendedLength = 20; // Length of the extended grid lines
  let spacing = 38; // Spacing between grid lines and the arrow

  push();
  stroke(4, 206, 245);
  strokeWeight(2);
  fill(4, 206, 245);

  // x is now set relative to the center of the canvas
  let x = isLeft ? xOffset : -xOffset;

  // Draw the outermost grid lines longer
  let yTop = centerY - 2 * spacing; // Position of the top line
  let yBottom = centerY + 2 * spacing; // Position of the bottom line
  line(x, yTop, x + (isLeft ? extendedLength : -extendedLength), yTop);
  line(x, yBottom, x + (isLeft ? extendedLength : -extendedLength), yBottom);

  // Draw the inner grid lines
  let yAbove = centerY - spacing; // Position above the arrow
  let yBelow = centerY + spacing; // Position below the arrow
  line(x, yAbove, x + (isLeft ? gridLength : -gridLength), yAbove);
  line(x, yBelow, x + (isLeft ? gridLength : -gridLength), yBelow);

  // Draw the connecting vertical line on the left side
  if (isLeft) {
    line(x, yTop, x, yBottom); // Connects the top and bottom grid lines
  } else {
    // If needed, draw a connecting line on the right side as well
    let xRight = x + (isLeft ? gridLength : -gridLength + 10);
    line(xRight, yTop, xRight, yBottom);
  }

  // Draw arrow
  let arrowX = isLeft ? x + arrowSize : x - arrowSize;
  line(x, centerY, arrowX, centerY);
  triangle(
    arrowX, centerY,
    arrowX + (isLeft ? -5 : 5), centerY - 5,
    arrowX + (isLeft ? -5 : 5), centerY + 5
  );

  pop();
}


