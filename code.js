
let curStage = 1;
let timer;

$('#audio').on('play', () => {
  shouldCreateNewShapes = true;
  $('.title').css('opacity', 0);

  startTimer();
})

$('#audio').on('pause', () => {
  shouldCreateNewShapes = false;
})

$('#audio').on('timeupdate', (e) => {
  const container = $('.mainContainer');
  const time = e.target.currentTime // in seconds
  if (time >= 0 && time < 20) {
    curStage = 1;
    frequencyOfShapes = 3;
    container.addClass('stage1');
    container.removeClass('stage2');
  } else if (time >= 20 && time < 50) {
    curStage = 2;
    frequencyOfShapes = 7;
    container.addClass('stage2');
    container.removeClass('stage1');
  } else if (time >= 50 && time < 60) {
    curStage = 3;
    container.addClass('stage1');
    container.removeClass('stage2');
  } else if (time >= 60) {
    curStage = 4;
    frequencyOfShapes = 3;
    container.addClass('stage1');
    container.removeClass('stage2');
  }
})


// rest of code is for drawing shapes

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

let shouldCreateNewShapes = true; 
let listOfShapes = []; // array containing all shape objects
let frequencyOfShapes = 2; // used to change the rate that shapes sapwn
let shapeGuaranteeFactor = 0;

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
  if (Math.random() * 100 <= (frequencyOfShapes + shapeGuaranteeFactor)) {
    // random generate a coordinate in the X plane to generate the shape in
    const startingX = Math.random() * window.innerWidth;
    // randomly generate a number between 0.9-1.2, used to scale the shapes so they're not all
    // the same size
    
    const scale = 0.9 + (Math.random() * 0.3);
    let curShape;
  
    switch (curStage) {
      case 1:
        curShape = new Square(startingX, scale);
        break;
      case 2:
        curShape = new Triangle(startingX, scale);
        break;
      case 3:
        return;
        break;
      case 4:
        curShape = new Circle(startingX, scale);
        break;
      default:
        curShape = new Square(startingX, scale);
        break;
    }
  
    listOfShapes.push(curShape);

    // reduce shapeGuarantee. minimum is -10, to prevent large clusters of shapes due to luck
    if (shapeGuaranteeFactor > -10) {
      shapeGuaranteeFactor -= 1.5;
    } 
    if (shapeGuaranteeFactor > 0) {
      shapeGuaranteeFactor = 0;
    }
  } else { // don't create new shape this iteration, incremenet the guarantee so it is more likely
  // for a shape to be created in the next iteration
    shapeGuaranteeFactor += 0.1;
  }


}

// main parent class
class Shape {
  constructor(x, r = 40) {
    this.x = x;
    this.r = r;
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
  constructor(x, scale) {
    super(x, 50 * scale);
  }

  draw() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#4287f5';
    ctx.fillRect(this.x, this.y, this.r, this.r);
    this.step();
  }
}

class Triangle extends Shape {
  constructor(x, scale = 1) {
    super(x, 60 * scale);
  }

  draw() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#cf4634';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.r/2, this.y + this.r);
    ctx.lineTo(this.x - this.r/2, this.y + this.r);
    ctx.fill();

    this.step();
  }
}

class Circle extends Shape {
  constructor(x, scale = 1) {
    super(x, 65 * scale);
  }

  draw() {
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#4287f5';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r/2, 0, 2 * Math.PI);
    ctx.fill();

    this.step();
  }
}