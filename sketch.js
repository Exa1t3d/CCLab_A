let redBloodCells = [];
let planets = [];
let redBloodCellSpeed = 2; // Speed of the red blood cells moving
let planetSpeed = 0.3; // Speed of the planet moving
let spikes = []; // Array to store spikes
let controlChangeTimeout;

let virus;


function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5container");
  let x = width / 2;
  let y = height / 2;
  virus = new Virus(width / 2, height / 2); // Initialize virus in the center of the screen


//sets red blood cell quantity
for (let i = 0; i < 90; i++) {
  let x = random(width);
  let y = random(height);
  let size = random(20, 40);
  let overlapping = false;

  // Check if the new cell overlaps with existing cells
  for (let j = 0; j < redBloodCells.length; j++) {
    let minDistance = 40; // Minimum distance between circumferences
    let d = dist(x, y, redBloodCells[j].x, redBloodCells[j].y);
    if (d < minDistance) {
      overlapping = true;
      break;
    }
  }

  // If overlapping, regenerate position until it's free
  while (overlapping) {
    x = random(width);
    y = random(height);
    overlapping = false;
    for (let j = 0; j < redBloodCells.length; j++) {
      let minDistance = 40; // Minimum distance between circumferences
      let d = dist(x, y, redBloodCells[j].x, redBloodCells[j].y);
      if (d < minDistance) {
        overlapping = true;
        break;
      }
    }
  }
  redBloodCells.push(new RedBloodCell(x, y, size));
}


  //sets planet quantity
  for (let i = 0; i < 9; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(4, 8);
    let overlapping = false;
    // Check if the new planet overlaps with existing planets
    for (let j = 0; j < planets.length; j++) {
      let d = dist(x, y, planets[j].x, planets[j].y);
      // Ensure there's a minimum gap of 30 pixels between planets
        let minDistance = 80; // Minimum distance between circumferences
      if (d < minDistance) {
        overlapping = true;
        break;
      }
    }
    // If overlapping, regenerate position until it's free
    while (overlapping) {
      x = random(width);
      y = random(height);
      overlapping = false;
      for (let j = 0; j < planets.length; j++) {
        let d = dist(x, y, planets[j].x, planets[j].y);
        let minDistance = 80; // Minimum distance between circumferences
        if (d < minDistance) {
          overlapping = true;
          break;
        }
      }
    }
    planets.push(new Planet(x, y, size));
  }
}



function draw() {
  drawRedBloodCells()
  drawPlanets();
  virus.display();
  virus.move();
}



// Creates red blood cells and translates them across the screen
function drawRedBloodCells() {
  background(0, 38, 71);

  // Shift the red blood cells to the left
  for (let i = 0; i < redBloodCells.length; i++) {
    redBloodCells[i].x -= redBloodCellSpeed; // Speed at which red blood cells move
    if (redBloodCells[i].x < 0) {
      redBloodCells[i].x = width;
    }
  }

  // Draw the red blood cells
  for (let i = 0; i < redBloodCells.length; i++) {
    redBloodCells[i].display();
  }
}


//Defines shape of red blood cells
class RedBloodCell {
  constructor(x, y, redBloodCellDiameter) {
    this.x = x;
    this.y = y;
    this.diameter = redBloodCellDiameter;
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(34, 1, 1); // Red color for blood cell
    noStroke();

    // Draw circular disc
    ellipse(0, 0, this.diameter);

    // Draw indent/crater in the middle
    let craterSize = this.diameter / 3.5; // Adjust size of the crater
    fill(179, 0, 27); // Black color for indent
    ellipse(0, 0, craterSize);

    pop();
  }
}



// Creates stars and translates them across the screen
function drawPlanets() {
  background(0, 0);

  // Shift the planets to the left
  for (let i = 0; i < planets.length; i++) {
    planets[i].x -= planetSpeed; // Speed at which planets move
    if (planets[i].x < 0) {
      planets[i].x = width;
    }

    // Check for collision with spaceship
    let d = dist(virus.x, virus.y, planets[i].x, planets[i].y);
    if (d < virus.diameter / 2 + planets[i].size / 2) {
      // If collision detected, create spikes around the virus
      virus.generateSpikes();
      // Remove the planet from the array
      planets.splice(i, 1);
      // Respawn the planet at the right edge of the screen with a random y position
      let size = random(4, 8);
      planets.push(new Planet(width, random(height), size));
      // Decrement index to avoid skipping next planet
      i--;
    }
  }

  // Draw the planets
  for (let i = 0; i < planets.length; i++) {
    planets[i].display();
  }
}



class Planet {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  display() {
  push();
  translate(this.x, this.y);

  // Base color for the planet
  let baseColor = color(137, 24, 133);

  // Patches of contrasting colors
  let patchColor1 = color(100, 100, 255);
  let patchColor2 = color(255, 100, 100);

  // Size of the planet
  let planetSize = 90;
    
    
  // Draw the planet as an ellipse
  fill(baseColor);
  noStroke();
  ellipse(0, 0, planetSize);

  // Draw patches on the planet
  fill(patchColor1);
  ellipse(planetSize * 0.3, planetSize * 0.2, planetSize * 0.4);

  fill(patchColor2);
  ellipse(-planetSize * 0.2, -planetSize * 0.3, planetSize * 0.3);

  pop();
}

}


//Defines the geometry of the virus
class Virus {
  constructor() {
    this.state = "AUTOMATIC";
      this.xoff = random(1000);  // for Perlin Noise
      this.yoff = random(1000);  // for Perlin Noise
    this.x = width / 2; // Set x-coordinate to center of the screen
    this.y = height / 2; // Set y-coordinate to center of the screen
    this.diameter = 40;
    this.color = color(218, 221, 225);
    this.speed = 5; // Speed of movement
    this.angle = 0; // Initial angle for rotation
    this.spikes = []; // Array to store spikes
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(this.color);
    noStroke();

    // Draw central circle
    ellipse(0, 0, this.diameter);

    // Draw spikes
    for (let i = 0; i < this.spikes.length; i++) {
      this.spikes[i].display();
    }

    pop();
  }

  //Defines the movement of the virus
   move() {
      if (keyIsDown(LEFT_ARROW) && this.x - this.diameter / 2 > 0) {
        this.x -= this.speed;
        this.switchToKeyboardControl();
      } if (keyIsDown(RIGHT_ARROW) && this.x + this.diameter / 2 < width) {
        this.x += this.speed;
        this.switchToKeyboardControl();
      } if (keyIsDown(UP_ARROW) && this.y - this.diameter / 2 > 0) {
        this.y -= this.speed;
        this.switchToKeyboardControl();
      } if (keyIsDown(DOWN_ARROW) && this.y + this.diameter / 2 < height) {
        this.y += this.speed;
        this.switchToKeyboardControl();
      } if (keyIsDown(65)) { // A key
        this.rotate(-0.1); // Counter-clockwise rotation
      } if (keyIsDown(68)) { // D key
        this.rotate(0.1); // Clockwise rotation
      } else {
        if(this.state === "AUTOMATIC") {
          // new noise-based movement
          this.x = map(noise(this.xoff), 0, 1, 0, width);
          this.y = map(noise(this.yoff), 0, 1, 0, height);
          // Increment xoff and yoff inputs to noise()
          this.xoff += 0.01;
          this.yoff += 0.01;
        }
      }
  }
  
  //Go back to being automatically controlled after 5 seconds of inactivity
  switchToKeyboardControl() {
      this.state = "KEYBOARD_CONTROLLED";
      clearTimeout(controlChangeTimeout);
      controlChangeTimeout = setTimeout(() => {
        this.state = "AUTOMATIC"
      }, 4200);
    }

  rotate(angle) {
    this.angle += angle;
    this.angle %= TWO_PI; // Keep angle within 0 to TWO_PI range
  }

  
  // Generate spikes around the circumference of the virus
 generateSpikes() {
  let totalNumberOfSpikesDisplayed = 12;
  for(let i = 0; i < totalNumberOfSpikesDisplayed; i++) {
    let spikeAngle = i * (TWO_PI / totalNumberOfSpikesDisplayed); // uniformly distributed angles
    
let r = random(155, 255);
let g = random(155, 255);
let b = random(155, 255);
let spikeColor = color(r, g, b);
    let spikeLength = 35;

    this.spikes.push(new Spike(0, -16, spikeLength, spikeColor, spikeAngle));
  }
}

// In class Spike:
display() {
  push();
  translate(this.x, this.y); // Translate to the origin of the circle
  rotate(this.angle); // Rotate the spike before drawing
  stroke(this.color);

  // Draw spikes outward from the origin
  line(0, 0, 0, -this.length);

  pop();
}


// In class Virus:
display() {
  push();
  translate(this.x, this.y);
  rotate(this.angle);

  // Draw spikes
  for (let i = 0; i < this.spikes.length; i++) {
    this.spikes[i].display();
  }

  // Draw central circle
  fill(this.color);
  noStroke();
  ellipse(0, 0, this.diameter);

  pop();
}
  
  
}


//Defines the geometry of the spikes
class Spike {
  constructor(x, y, length, color, angle) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color;
    this.angle = angle; // Store the angle for rotation
  }

  display() {
    push();
    translate(this.x, this.y + this.length / 2); // Translate to the center of the circle at the tip of the spike
    rotate(this.angle); // Rotate the spike to the stored angle
    fill(this.color); // Use assigned color for spike
    noStroke();

    // Draw rectangle
    rectMode(CENTER);
    rect(0, -this.length / 2, 5, this.length); // Adjust rectangle position to align with new translation

    // Draw circle on top of rectangle
    ellipse(0, -this.length, 10); // Adjust circle position relative to the rectangle

    pop();
  }
}

