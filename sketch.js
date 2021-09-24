var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score = 0;
var trex, trex_running;
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimg = loadImage("ground2.png");
  cloudimg = loadImage("cloud.png");
  obstacleimg1 = loadImage("obstacle1.png");
  obstacleimg2 = loadImage("obstacle2.png");
  obstacleimg3 = loadImage("obstacle3.png");
  obstacleimg4 = loadImage("obstacle4.png");
  obstacleimg5 = loadImage("obstacle5.png");
  obstacleimg6 = loadImage("obstacle6.png");
  birdimg = loadImage("bird.png");
  trexCollidedimg = loadAnimation("trex_collided.png");
  gameOverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  checkPointsound = loadSound("checkPoint.mp3");
  diesound = loadSound("die.mp3");
  jumpsound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);

  //create a trex sprite
  trex = createSprite(50, 118, 20, 50);
  
  trex.setCollider("rectangle",0,0,trex.width+60,trex.height);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trexCollidedimg);
  trex.scale = 0.7;
  edges = createEdgeSprites();
  //creating the ground
  ground = createSprite(180, 170, 1000, 10);
  ground.addImage(groundimg);
  //creating the invisible ground to collide with the trex
  invisibleground = createSprite(10, 178, 100, 5);
  invisibleground.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  birdsGroup = new Group();


  gameOver = createSprite(300, 100);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(300, 140);
  restart.scale = 0.5;
  restart.visible = false;

  gameOver.addImage(gameOverimg);
  restart.addImage(restartimg);
  
  
}

function draw() {
  background("white");

  text("Score:" + score, 500, 40);

  if (gameState == PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(score/100 + 4)
    //making trex jump
    if (keyDown("space")&& trex.y > 147) {
      trex.velocityY = -10;
      jumpsound.play();
    }
    //adding gravity
    trex.velocityY = trex.velocityY + 0.5;

    //resetting the ground
    if (ground.x < 100) {
      ground.x = ground.width / 2;
    }
    spawnClouds();
    spawnObstacles();
    spawnBirds();

    if (trex.isTouching(obstaclesGroup)) {
      gameState = END;
      diesound.play();
    }
  } else if (gameState == END) {
    ground.velocityX = 0;

    obstaclesGroup.setVelocityXEach(0);
    birdsGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided", trexCollidedimg);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    birdsGroup.setLifetimeEach(-1);

    trex.velocityY = 0;

    gameOver.visible = true;
    restart.visible = true;
  }

  //colliding trex with the ground
  trex.collide(invisibleground);
  
  if(score  % 100 == 0 && score > 0){
     checkPointsound.play();
     }
  
  if(mousePressedOver(restart)){
     reset();
     }

  //drawing the sprites
  drawSprites();
}
function spawnClouds() {
  if (frameCount % 50 == 0) {
    var cloud = createSprite(700, 10, 30, 20);
    cloud.velocityX = -4;
    cloud.addImage(cloudimg);
    cloud.scale = 0.5;
    cloud.y = random(10, 60);
    trex.depth = cloud.depth + 1;
    cloud.lifetime = 180;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 80 == 0) {
    var obstacle = createSprite(600, 145, 30, 20);
    obstacle.velocityX = -(score/100 + 4)
    var r = Math.round(random(1, 6));
    switch (r) {
      case 1:
        obstacle.addImage(obstacleimg1);
        break;
      case 2:
        obstacle.addImage(obstacleimg2);
        break;
      case 3:
        obstacle.addImage(obstacleimg3);
        break;
      case 4:
        obstacle.addImage(obstacleimg4);
        break;
      case 5:
        obstacle.addImage(obstacleimg5);
        break;
      case 6:
        obstacle.addImage(obstacleimg6);
        break;
    }
    obstacle.scale = 0.7;
    obstacle.lifetime = 180;
    obstaclesGroup.add(obstacle);
  }
}

function spawnBirds() {
  if (frameCount % 200 == 0) {
    var bird = createSprite(700, 10, 30, 20);
    bird.velocityX = -4;
    bird.addImage(birdimg);
    bird.scale = 0.3;
    bird.y = random(10, 60);
    trex.depth = bird.depth + 1;
    bird.lifetime = 180;
    birdsGroup.add(bird);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  birdsGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_running)
}
