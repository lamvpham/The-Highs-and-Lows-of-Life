class SlotMachineWheel {
    constructor(options, leftRight, isSecondWheel) {
      // options for the slots
      this.options = options; 
      this.labels = [...this.options];

      // wheel logistics
      this.numSpots = 21; // number of slots
      this.currentAngle = 0; // current angle of wheel
      this.leftRight = leftRight; // positioning
      this.spinnerSize = 200; // wheel size
      this.spinnerWidth = 110; // width of slots

      // other logistics
      this.isSecondWheel = isSecondWheel; // flag to identify if it's the second wheel
      this.resetLabels();
      this.focusedIndex = null; // to display correct index label on console
  
      // for speed of spinning
      this.acceleration = 0.07;
      this.speed = 0; // start with 0 speed and acceleration
      this.minSpeed = 0.025; 
      this.maxSpeed = random(10, 20);
      this.isDecelerating = false;
      this.decelerationStart = 0;
      this.spinning = false;
      this.spinDuration = random(2500, 3500); // duration before starting to decelerate

  
      // angles of each of the slot positions:
      this.angles = [];
      for (let i = 0; i < this.numSpots; i++) {
        let angle = (360 / this.numSpots) * i; // for even distribution of slots around wheel
        this.angles.push(angle);
      }
    }
  
    // determining angle of a spcific slot on the wheel based on its index
    angleIndex(i) {
      return (360 / this.numSpots) * i;
    }

    // randomization of label placements in slots
    resetLabels() {
      this.labels = [];
      for (let i = 0; i < this.numSpots; i++) {
        let label = this.options[floor(random(this.options.length))];
        this.labels.push(label);
      }
    }
  
    // updating wheel state as it spins
    advance() {
      if (this.spinning) {
        let currentTime = millis(); // tracking time to manage accleration and deceleration
    
        // check if it's time to start decelerating
        if (currentTime > this.decelerationStart && !this.isDecelerating) {
          this.isDecelerating = true;
        }
    
        // acceleration
        if (!this.isDecelerating) {
          this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        }
    
        // deceleration
        if (this.isDecelerating) {
          // gradual deceleration
          this.speed *= this.deceleration;
          this.deceleration -= (1 - this.deceleration) * 0.002; // slowly approach 1 to decelerate more gently
    
          // when speed reaches minSpeed, consider wheel as stopped
          if (this.speed <= this.minSpeed) {
            this.speed = 0;
            this.spinning = false;
          }
        }

        // when wheel stops
        if (this.speed <= this.minSpeed) {
          this.speed = 0;
          this.spinning = false; 
        }
    
        // update wheel's current angle
        this.currentAngle = (this.currentAngle + this.speed) % 360;
      }
    }
    
    // for every spin behaviour to be consistent with its subsequent spin
    spin() {
      if (!this.spinning) {
        this.spinning = true;
        this.isDecelerating = false;
        this.speed = this.minSpeed; // start with min speed, then accelerate
        this.spinTime = millis(); // store current time
        this.decelerationStart = this.spinTime + this.spinDuration;
        this.deceleration = 0.997; // value less than 1 to reduce speed over time + reset the deceleration to its initial value for each new spin
        displayLabels = false;
      }
    }
    
    // updating wheel's state frame by frame
    update() {
      this.advance();
      this.display();

      if (this.spinning) {
        this.updateFocusedIndex(); // for focused slot state
      }
    }

    // to identify which slot is in focus state that's facing the user at 90 degrees
    updateFocusedIndex() {
      let closestSlotIndex = null; // store slot index closest to target angle
      let smallestAngleDifference = Infinity; // track angle differences between slot and target angle
  
      // determine closest slot to the 90 degree position
      for (let i = 0; i < this.numSpots; i++) {
        // static angle coordinate system
        let staticAngle = (360 - this.currentAngle + this.angleIndex(i)) % 360; // within 0-360 degree range
        if (staticAngle < 0) staticAngle += 360; // mormalize angle
  
        // abs difference between slot angle and 90 degrees
        let angleDifference = Math.abs(staticAngle - 90);
        // if smaller than previous, update variables
        if (angleDifference < smallestAngleDifference) {
          smallestAngleDifference = angleDifference;
          closestSlotIndex = i;
        }
      }
  
      // if closest slot is within the 10 degree focus tolerance
      if (smallestAngleDifference <= 10) {
        this.focusedIndex = closestSlotIndex;
      } 
      // else {
      //   this.focusedIndex = null; // no slot is sufficiently focused
      // }
    }

    // visual representation of slots, labels, and wheel
    display() {
      // aesthetics for slots
      push();
      translate(this.leftRight, 0, 0)
      rotateZ(90); // then put the wheel up on edge
      rotateY(this.currentAngle); // rotate wheel to current angle
      strokeWeight(2); // stroke fo slot borders
  
      // determine index of slot closest to 90 degree position
      let closestSlotIndex = 0;
      let smallestAngleDifference = 360; // initialize with max possible difference
  
      // drawn as its own loop to ensure that only one slot is selected -> when inside the for loop below, it can select two at the same time and I'm not sure why
      for (let i = 0; i < this.numSpots; i++) {
        // static angle coordinate system
        let staticAngle = (360 - this.currentAngle + this.angleIndex(i)) % 360;
        if (staticAngle < 0) staticAngle += 360; // normalize angle

        // abs difference between slot angle and 90 degrees
        let angleDifference = Math.abs(staticAngle - 90);
        // if smaller than previous, update variables
        if (angleDifference < smallestAngleDifference) {
            smallestAngleDifference = angleDifference;
            closestSlotIndex = i;
        }
      }

      // draw current labels onto wheel
      for (let i = 0; i < this.numSpots; i++) {
        push();
        rotateY(-this.angles[i]); // orientation of slot
        translate(this.spinnerSize + 1, 0, 0); // orientation of slot
  
        // check if this slot is the closest to the 90 degree position
        let isFocused = i === closestSlotIndex && smallestAngleDifference < 10; 
 
        if (isFocused) {
          fill(255, 0, 51, 35); // semi-transparent slot for glow
          noStroke();
          box(0.2, this.spinnerWidth + 10, 60); // slightly larger box 
          stroke(255, 0, 51); // inner slot stroke
          translate(1,0,0)
        } else {
          fill(4, 206, 245, 14); // semi-transparent slot for glow
          noStroke();
          box(0.2, this.spinnerWidth + 10, 60); // Slightly larger box=
          stroke(4, 206, 245); // inner slot stroke
          translate(1,0,0)
        }
        box(0.1, this.spinnerWidth, 50); // draw slot
  
        // text color based on focus
        if (isFocused) {
            fill(255, 0, 51); 
        } else {
            fill(4, 206, 245); 
        }

        translate(3, 0, -5); // location of the text (level to the wheel, side to side, height)
        rotateY(90);
        rotateZ(-90);
        textSize(14);

        // label displayed on second wheel is based on currentEmotions array
        let label = this.isSecondWheel ? currentEmotions[i % currentEmotions.length] : this.labels[i];
        text(label || "", 0, 0);
        pop();
      }
      pop();
    }
}