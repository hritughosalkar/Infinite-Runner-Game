var PLAY = 1;
var END = 0;
var gameState = PLAY;

var player, player_running, player_collided;
var ground, invisibleGround, groundImage;

var coinsGroup,coins;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;



function preload(){
  player_running =   loadAnimation("player1.png","player2.png","player3.png");
  player_collided = loadAnimation("player2.png");
  
  groundImage = loadImage("background1.jpg");
  
  coins = loadAnimation("coin1.png","coin2.png","coin3.png","coin4.png","coin5.png","coin6.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  takecoinSound=loadSound("takecoin.mp3");
  
  jumpSound=loadSound("jump sound.mp3");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(1530,770);
  
  player = createSprite(50,600);
  
 
  player.addAnimation("running", player_running);
  player.addAnimation("collided", player_collided);
  player.scale = 0.5;
 // player.visible=true;
  
  ground = createSprite(750,400,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale=1.7;
  
  gameOver = createSprite(720,250);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(720,350);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(20,700,1200,10);
  invisibleGround.visible = false;
  
  coinsGroup = new Group();
 
  
  obstaclesGroup = new Group();
  
  score = 0;

  //player.setCollider("circle",0,0,40)
}

function draw() {
  
  background(255);
  
  
  if (gameState===PLAY){

   
    //score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    player.changeAnimation("running", player_running);
    if(keyDown("space") && player.y >= 159) {
      player.velocityY = -20;
      player.changeAnimation("collided", player_collided);
      jumpSound.play();
    }
  
    player.velocityY = player.velocityY + 0.8
  
    if (ground.x < 100){
      ground.x = 800;
    }
    ground.scale=3
  
    player.collide(invisibleGround);
    spawnCoins();
    spawnObstacles();

    if(player.isTouching(coinsGroup)){
      score=score+5;
      coinsGroup.destroyEach();
      takecoinSound.play();
    }
    if(obstaclesGroup.isTouching(player)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    player.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    //change the player animation
    player.changeAnimation("collided",player_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
   
  }
  
  
  drawSprites();
  textSize(25);
 fill("red");
  text("Score: "+ score, 1000,100);
}

function spawnCoins() {
  //write code here to spawn the coins
  if (frameCount % 100 === 0) {
     coin = createSprite(1000,400);
    coin.y = Math.round(random(300,400));
    coin.addAnimation("coins",coins);
    coin.scale = 0.2;
    coin.velocityX = -5;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each coin to the group
    coinsGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(1400,600,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
     
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  
  player.changeAnimation("running",player_running);
  
 
  
  score = 0;
  
}