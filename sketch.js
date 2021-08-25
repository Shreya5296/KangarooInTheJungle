var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisibleGround;

var obstaclesGroup, obstacle1;

var shurbs,shrubsGroup;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  jungle = createSprite(width/2,height/2);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.4;
  
  invisibleGround = createSprite(width/2,height/2 + 300,1600,10);
  invisibleGround.visible = false;

  kangaroo = createSprite(300,height -200,15,15);
  kangaroo.addAnimation("running",kangaroo_running);
  kangaroo.addAnimation("collided",kangaroo_collided);
  kangaroo.scale = 0.3;

  kangaroo.setCollider("circle",0,0,300);

  gameOver = createSprite(width/2,height/2);
  gameOver.addImage("gameover",gameOverImg);
  gameOver.visible = false;

  restart = createSprite(width/2,height/2 +100);
  restart.addImage("restart",restartImg);
  restart.scale = 0.2;
  restart.visible = false;

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  kangaroo.x = camera.position.x -270;
  if(gameState === PLAY){
    jungle.velocityX = -3;
    if(jungle.x < width/2 -100){
      jungle.x = width/2;
    }
    
    if(keyDown("SPACE") && kangaroo.y > 350){
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
    kangaroo.velocityY = kangaroo.velocityY +0.8;
    kangaroo.collide(invisibleGround);

    spawnShrub();
    spawnObstacle();

    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      // kangaroo.changeAnimation("collided",kangaroo_collided);
      gameState = END;
    }

    if(shrubsGroup.isTouching(kangaroo)){
      shrubsGroup.destroyEach();
      score += 10;
    }
  }

  else if(gameState === END){
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    kangaroo.changeAnimation("collided",kangaroo_collided);
    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)){
      reset();
    }
    
  }
  else if(gameState === WIN){
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    restart.visible = true;

    if(mousePressedOver(restart)){
      reset();
    }

    kangaroo.changeAnimation("running",kangaroo_running);
  }

  drawSprites();
  fill("White");
  textSize(40);
  text("Score : ",100,50);
  text(score,250,55);
  if(score >= 100){
    kangaroo.visible = false;
    textSize(40);
    stroke("red");
    fill("black");
    text("CONGRATULATIONS YOU WON THE GAME",width/2 - 350,height/2);
    gameState = WIN;
  }
}

function spawnObstacle(){
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,height/2 + 300,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;       
    obstacle.debug=true    
    obstacle.lifetime = 400;
    
    obstaclesGroup.add(obstacle);
  }
}

function spawnShrub(){
  if (frameCount % 180 === 0) {

    var shrub = createSprite(camera.position.x+500,height/2 + 300,40,10);

    shrub.debug=true;
    shrub.velocityX = -(6 + 3*score/100)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
           
    shrub.scale = 0.05;
    shrub.lifetime = 400;
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    
    shrubsGroup.add(shrub);
  }
}

function reset(){
  gameState = PLAY;
  score = 0;
  gameOver.visible = false;
  restart.visible = false;
  kangaroo.visible = true;
  kangaroo.changeAnimation("running",kangaroo_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
}