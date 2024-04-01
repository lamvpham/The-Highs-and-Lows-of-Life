class SlotMachineWheel {
    constructor(options, leftRight) {
      this.options = options;
      this.numSpots = 21;
      this.currAngle = 0;
  
      this.leftRight = leftRight;
  
      this.spinnerSize = 200;
      this.spinnerWidth = 100;
  
      this.speed = 0; // Start with 0 speed and accelerate
  
      this.lastFound = "";
  
      this.labels = [];
      this.resetLabels();

      // to display correct index label on console
      this.focusedIndex = null; 
  
      // for speed of spinning + reel bounce
      this.acceleration = 0.07;
      this.minSpeed = 0.025; // Minimum speed before stopping
      this.maxSpeed = 20; // Maximum speed the wheel will reach while spinning is 20
      this.isDecelerating = false;
      this.spinning = false;
  
      // this.spinTime = 0;
      this.decelerationStartTime = 0;
      this.spinDuration = 3500; // Duration in milliseconds before starting to decelerate
  
  
      // get angles of each of the forward positions:
      this.angles = [];
      for (let i = 0; i < this.numSpots; i++) {
        let angle = (360 / this.numSpots) * i;
        this.angles.push(angle);
      }
    }
  
    removeLastOptionFound() {
      console.log('removing ', this.lastFound);
      console.log(this.options);
      if (this.options.length > 1) { // Ensure there's more than one option to remove
          this.options = this.options.filter((option) => option !== this.lastFound);
      }
      console.log(this.options);
      this.resetLabels();
    }
  
    getAngleFromIndex(i) {
      return (360 / this.numSpots) * i;
    }
    resetLabels() {
      this.labels = [];
      for (let i = 0; i < this.numSpots; i++) {
        let label = this.options[floor(random(this.options.length))];
        this.labels.push(label);
      }
    }
  
  
    advance() {
      if (this.spinning) {
        let currentTime = millis();
    
        // Check if it's time to start decelerating
        if (currentTime > this.decelerationStartTime && !this.isDecelerating) {
          this.isDecelerating = true;
        }
    
        // Handle acceleration
        if (!this.isDecelerating) {
          this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        }
    
        // Handle deceleration
        if (this.isDecelerating) {
          // Make deceleration more gradual
          this.speed *= this.deceleration;
          this.deceleration -= (1 - this.deceleration) * 0.002; // Slowly approach 1 to decelerate more gently
    
          // When the speed is very low, consider the wheel as stopped
          if (this.speed <= this.minSpeed) {
            this.speed = 0;
            this.spinning = false; // Wheel stops spinning
            this.onSpinDone();
          }
        }

        // When the wheel stops
        if (this.speed <= this.minSpeed) {
          this.speed = 0;
          this.spinning = false; // Wheel stops spinning
          this.focusedIndex = this.findClosestLabelIndex(); // Store the focused index
          this.onSpinDone();
      }
    
        // Update the wheel's current angle
        this.currAngle = (this.currAngle + this.speed) % 360;
      }
    }
    
    
    // for every spin behaviour to be consistent with its subsequent spin
    spin() {
      if (!this.spinning) {
        this.spinning = true;
        this.isDecelerating = false;
        this.speed = this.minSpeed; // Start with min speed, then accelerate
        this.spinTime = millis(); // Capture the current time
        this.decelerationStartTime = this.spinTime + this.spinDuration;
        this.deceleration = 0.997; // value less than 1 to reduce speed over time + reset the deceleration to its initial value for each new spin
        displayLabels = false;
      }
    }
    
    
  
    update() {
      this.advance();
      this.display();
    }
  
    display() {
      push();
      translate(this.leftRight, 0, 0)
      rotateZ(90); // then put the cylinder up on edge
      rotateY(this.currAngle); // rotate wheel to current angle
      strokeWeight(2); // stroke fo slot borders
  
      // Determine the index of the slot that is closest to the 90-degree position
      let closestSlotIndex = 0;
      let smallestAngleDifference = 360; // Initialize with max possible difference
  
  
      // drawn as its own loop to ensure that only one slot is selected -> when inside the for loop below, it can select two at the same time and I'm not sure why
      for (let i = 0; i < this.numSpots; i++) {
        // Calculate the static angle of the slot
        let staticAngle = (360 - this.currAngle + this.getAngleFromIndex(i)) % 360;
        if (staticAngle < 0) staticAngle += 360; // Normalize angle
    
        let angleDifference = Math.abs(staticAngle - 90);
        if (angleDifference < smallestAngleDifference) {
            smallestAngleDifference = angleDifference;
            closestSlotIndex = i;
        }
      }

      // draw the current labels onto the cylinder
      for (let i = 0; i < this.numSpots; i++) {
        push();
        rotateY(-this.angles[i]);
        translate(this.spinnerSize + 1, 0, 0);
  
        // Check if this slot is the closest to the 90-degree position
        let isFocused = i === closestSlotIndex && smallestAngleDifference < 10; // Reduced tolerance
  
        if (isFocused) {
          fill(255, 0, 51, 35); // Semi-transparent
          noStroke();
          box(0.2, this.spinnerWidth + 10, 60); // Slightly larger box for glow
          translate(1,0,0)
        } else {
          fill(4, 206, 245, 14); // Semi-transparent
          noStroke();
          box(0.2, this.spinnerWidth + 10, 60); // Slightly larger box for glow
          translate(1,0,0)
        }
  
        // Apply fill based on the static system for focus
        if (isFocused) {
          stroke(255, 0, 51); // White fill for the focused slot
        } else {
          stroke(4, 206, 245); 
        }
        box(0.1, this.spinnerWidth, 50); // draw the choice box
  
  
        // Set the text color based on focus
        if (isFocused) {
            fill(255, 0, 51); // Change text color when in focus
        } else {
            fill(4, 206, 245); // Default text color
        }
        translate(3, 0, -5); // location of the text (level to the wheel, side to side, height)
        rotateY(90);
        rotateZ(-90);
        textSize(14);
  
        text(this.labels[i] || "", 0, 0); // Use an empty string if the label is undefined & slight downward offset so its closer to the center of the cylinder face
        pop();
      }
  
      pop();
    }



    onSpinDone() {
      this.focusedIndex = this.findClosestLabelIndex();
    }
  


    
    findClosestLabelIndex() {
      // Similar logic as in display to determine the closestSlotIndex
      let closestIndex = 0;
      let smallestAngleDifference = 360;
  
      for (let i = 0; i < this.numSpots; i++) {
          let staticAngle = (360 - this.currAngle + this.getAngleFromIndex(i)) % 360;
          if (staticAngle < 0) staticAngle += 360;
  
          let angleDifference = Math.abs(staticAngle - 90);
          if (angleDifference < smallestAngleDifference) {
              smallestAngleDifference = angleDifference;
              closestIndex = i;
          }
      }
      return closestIndex;
    }
  
  
}