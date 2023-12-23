var collectionName = 'Others';
var projectName = 'Merry_Christmas_Cardano_2023';
let frameRateValue = 30;
let resX = 800;
let resY = 800;

//snow array variable
let snowflakes = []; // array to hold snowflake objects

//text variables
let _text; //top text
let _text2; //bottom text
let writeText = 'Merry Christmas';
let writeText2 = 'CARDANO';
let font;
let font_2;

//star variables
let numPoints = 5;
let radius1 = 5;
let radius2 = 15;
let spacing = 1;

//tree variables
var scaleXaxis = 50;
var scaleYaxis = 165;
var scaleZaxis = scaleXaxis;

var treeLen = 30;
var speedForRotation = 0.3;
var numberOfPieces = 4;
let color;

//load Montserrat fonts
function preload() {
  font = loadFont('Montserrat-Thin.otf');
  font_2 = loadFont('Montserrat-Regular.otf');
}

function setup() {
  frameRate(frameRateValue);

  createCanvas(resX, resY, WEBGL);
  background(0);
  
  //set up text
  _text = createGraphics(resX, resY);
  _text.textFont(font);
  _text.textAlign(CENTER);
  _text.textSize(25);
  _text.fill(255,255,255);
  _text.noStroke();
  _text.text(writeText, resX/2,70);
  
  
  //setup GIF save button
  let button = createButton('Create GIF');
  button.mousePressed(() => {
    //saveGif(gifFileName, gifDuration);
    saveGif('MerryChristmasCardano', 300, {delay: 0, units : 'frames'});
  });
  
}

function draw() {
  
  
  background(0);
  noStroke();

  // snow creation
  if (random(1) > 0.05) {
    let x = random(width);
    if (x < 250 || x > 550) //ensure snow is not on the tree
    {
      let y = random(-height / 2, height / 2);
      let z = random(-200, 200);
      let radius = random(0.1, 4);
      let snowflake = new Snowflake(x - width / 2, y, z, radius);
      snowflakes.push(snowflake);
    }
  }

  // Draw and update existing snowflakes
  for (let i = snowflakes.length - 1; i >= 0; i--) {
    snowflakes[i].update();
    snowflakes[i].display();

    // Remove snowflake if it's out of view
    if (snowflakes[i].y > height / 2) {
      snowflakes.splice(i, 1);
    }
  }

  //text texture and second line
  texture(_text);
  _text.textFont(font_2);
  _text.text(writeText2, 400,100);
  plane(resX, resY);
  
  //move the tree
  translate(0, -220, 0); 
  //adjust the stroke
  strokeWeight(2);

  //Tree
  var theta = speedForRotation * TWO_PI * frameCount / frameRateValue;
  let offset = 0;
  
  for (var i = 0; i < numberOfPieces; i++) {
    if (i%2==0){ color = 'pink'}
    else {color='white'}
    ral(treeLen, i / numberOfPieces * TWO_PI + theta, offset, color);
  }
  
  //Star
  if (frameCount % 2 ==0){
    stroke("white");
  }
  else {
    stroke("pink");
  }
  translate(0, -20, 0)
  rotateStar();
  drawRotatingStar(numPoints, radius1, radius2, spacing);

}

function ral(arcDistance, rotation, tStart, color) {
  let t = tStart, i = 0
  while (scaleYaxis * t < 500) {

    push();
    stroke(color);
    let p = position(t, rotation);
    

    if (t >= 0) {
      point(p.x, p.y, p.z);
    }

    let slope = tangent(i);
    let dt = arcDistance / dist(0, 0, 0, slope.x+50, slope.y+200, slope.z);
   
    pop();
    
    i++;
    t += dt;
  }
}

function position(t, rotation) {
  return createVector(
    scaleXaxis * cos(t * TWO_PI + rotation) * t,
    scaleYaxis * t,
    scaleZaxis * sin(t * TWO_PI + rotation) * t
  );
}

function tangent(t) {
  return createVector(
    scaleXaxis * (-t * sin(t) + cos(t)),
    scaleYaxis,
    scaleZaxis * (t * cos(t) + sin(t)));
}

function rotateStar() {
  rotateX(frameCount * 0.075);
  rotateY(frameCount * 0.075);
}

function drawRotatingStar(numPoints, radius1, radius2, spacing) {
  //
  beginShape();
  for (let i = 0; i < numPoints * 2; i++) {
    let angle = i * TWO_PI / (numPoints * 2);
    let x = cos(angle) * radius1;
    let y = sin(angle) * radius1;
    if (i % 2 === 0) {
      x = cos(angle) * radius2;
      y = sin(angle) * radius2;
    }
    ellipse(x, y, spacing, spacing);
  }
  endShape(CLOSE);
}

function snowflake(){

  this.posX = 0;
  this.posY = random(-50,0);
  this.initialangle = random(0,2*PI);
  this.size = random(2,5);
  this.radius = sqrt(random(pow(width/2,2)));

  this.update = function(time)
  {

    // x position follows a circle
    let w = 0.6; 
    let angle = w*time + this.initialangle;
		this.posX = width/2 + this.radius*sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size,0.5);
    
    // delete snowflake if past end of screen
    if(this.posY > height)
    {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index,1);
    }

  };

  this.display = function(){
    ellipse(this.posX,this.posY,this.size);
  };
}


class Snowflake {
  constructor(x, y, z, radius) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.radius = radius;
  }

  update() {
    // Simulate snowflake falling
    this.y += 2;

    // Add some side-to-side movement
    this.x += sin(this.y * 0.1) * 2;
  }

  display() {
    push();
    translate(this.x, this.y, this.z);
    fill(255);
    ellipse(0, 0, this.radius * 2, this.radius * 2);
    pop();
  }
}