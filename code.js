
let timer;


// audio ended, show credits
$('#audio').on('ended', () => {
  shouldCreateNewShapes = false;
  $('.credits').css('display', 'flex');
})

$('.credits').on('click', () => {
  $('.credits').css('display', 'none');
})


$('#audio').on('play', () => {
  shouldCreateNewShapes = true;
  $('.title').css('opacity', 0);

  startTimer();
})

$('#audio').on('pause', () => {
  shouldCreateNewShapes = false;
})


$('#audio').on('timeupdate', (e) => {
  const time = e.target.currentTime // in seconds
  if (time >= 0 && time < 35) { // begining scene, talk about project
    frequencyOfShapes = 3;
    setShape('square');
    setShapeColor('#4287f5');
    setBG('blue');
  } else if (time >= 35 && time < 78) { // fire alarm starts
    frequencyOfShapes = 5;
    setShapeColor('#e08793');
    setShape('square');
    setBG('orange');
  } else if (time >= 78 && time < 96) { // tense music starts playing
    frequencyOfShapes = 7;
    setShapeColor('#d17034');
    setShape('square')
    setBG('red');
  } else if (time >= 96 && time < 109) { // door not opening
    frequencyOfShapes = 10;
    setShapeColor('#d17034');
    setShape('triangle')
    setBG('red');
  } else if (time >= 109 && time < 125) { // jun: i cant breath
    frequencyOfShapes = 10;
    setShapeColor('#cf4634');
    setShape('triangle')
    setBG('darkred');
  } else if (time >= 125 && time < 153) { // eva: we're all gonna die
    frequencyOfShapes = 13;
    setShapeColor('#cf4634');
    setShape('triangle')
    setBG('darkred');
  } else if (time >= 153 && time < 168) { // fade out scene
    setShape('none')
    setBG('white');
  } else if (time >= 168) { // hospital scene
    frequencyOfShapes = 3;
    setShapeColor('#679cf0');
    setShape('circle');
    setBG('blue');
  }
})

// square, triangle, circle
function setShape(type = 'square') {
  shapeType = type;
}

function setShapeColor(color = '#4287f5') {
  shapeColor = color;
}

function setBG(color = 'blue') {
  const container = $('.mainContainer');
  switch (color) {
    case 'red':
      container.css('background', 'rgba(235, 150, 124, 0.7)');
      break;
    case 'darkred':
      container.css('background', 'rgba(224, 118, 114, 0.7)');
      break;
    case 'orange':
      container.css('background', 'rgba(230, 199, 154, 0.7)');
      break;
    case 'white':
      container.css('background', 'rgba(209, 228, 232, 0.7)');
      break;
    case 'lightblue':
      container.css('background', 'rgba(230, 230, 230, 0.7)');
      break;
    default: // blue
      container.css('background', 'rgba(129, 208, 240, 0.7)');
      break;
  }
}


// rest of code is for drawing shapes

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

let shouldCreateNewShapes = true; 
let listOfShapes = []; // array containing all shape objects
let frequencyOfShapes = 2; // used to change the rate that shapes sapwn
let shapeGuaranteeFactor = 0;

let shapeColor = '#4287f5';
let shapeType = 'square';

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    canvas.width = window.innerWidth;; //document.width is obsolete
    canvas.height = window.innerHeight;
    // move shapes
    for (var i = listOfShapes.length - 1; i >= 0; i--) {
      const curShape = listOfShapes[i];
      if (curShape.isOutOfBounds()) {
        listOfShapes.splice(i, 1);
      } else {
        curShape.draw();
      }
    }

    shapeCreatorController();
  }, 50)
}

// function that controls drawing new shapes
function shapeCreatorController() {
  if (!shouldCreateNewShapes) return;
  // drawing shapes
  // use random number generator to determine whether to create a new shape at this setInterval
  // iteration. Math.random * 100 returns 0-100, so frequencyOfShapes will be the percentage of
  // a shape happening at each iteration. e.g freqShapes = 2, % of a shape created every 0.05s is
  // 2%. shapeGuaranteeFactor is used to reduce the chances of shapes not spawning for some time,
  // or too many spawning at the same time
  if (Math.random() * 100 <= (frequencyOfShapes * (1 + shapeGuaranteeFactor))) {
    // random generate a coordinate in the X plane to generate the shape in
    const startingX = Math.random() * window.innerWidth;
    // randomly generate a number between 0.9-1.2, used to scale the shapes so they're not all
    // the same size
    
    const scale = 0.9 + (Math.random() * 0.3);
    let curShape;
  
    switch (shapeType) {
      case 'square':
        curShape = new Square(startingX, shapeColor, scale);
        break;
      case 'triangle':
        curShape = new Triangle(startingX, shapeColor, scale);
        break;
      case 'circle':
        curShape = new Circle(startingX, shapeColor, scale);
        break;
      default:
        return;
        break;
    }
  
    listOfShapes.push(curShape);

    // reduce shapeGuarantee. minimum is -0.5, to prevent large clusters of shapes due to luck
    if (shapeGuaranteeFactor > -0.4) {
      shapeGuaranteeFactor -= 0.15;
    } 
    if (shapeGuaranteeFactor > 0) {
      shapeGuaranteeFactor = 0;
    }
  } else { // don't create new shape this iteration, incremenet the guarantee so it is more likely
  // for a shape to be created in the next iteration
    shapeGuaranteeFactor += 0.07;
  }


}

// main parent class
class Shape {
  constructor(x, shapeColor, r = 40) {
    this.x = x;
    this.r = r;
    this.shapeColor = shapeColor;
    this.y = window.innerHeight + this.r;
    this.speed = 5;
  }

  move() {
    this.y -= this.speed;
  }

  step() {
    this.move()
    this.speed += 0.07;
  }

  isOutOfBounds() {
    return (this.y + this.r < 0)
  }
}


// all type of shapes extend from Shape

class Square extends Shape {
  constructor(x, shapeColor, scale) {
    super(x, shapeColor, 50 * scale);
  }

  draw() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = this.shapeColor;
    ctx.fillRect(this.x, this.y, this.r, this.r);
    this.step();
  }
}

class Triangle extends Shape {
  constructor(x, shapeColor, scale = 1) {
    super(x, shapeColor, 60 * scale);
  }

  draw() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = this.shapeColor;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.r/2, this.y + this.r);
    ctx.lineTo(this.x - this.r/2, this.y + this.r);
    ctx.fill();

    this.step();
  }
}

class Circle extends Shape {
  constructor(x, shapeColor, scale = 1) {
    super(x, shapeColor, 65 * scale);
  }

  draw() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = this.shapeColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r/2, 0, 2 * Math.PI);
    ctx.fill();

    this.step();
  }
}