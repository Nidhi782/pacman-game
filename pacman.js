// board
 let board;
 const rowCount = 21;
 const columnCount = 19;
 const tileSize = 32;
 const boardWidth = columnCount*tileSize;
 const boardHeight = rowCount*tileSize;
 let context;

//  images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;


window.onload = function(){
    board = this.document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    loadImages();
    loadMap();
   //  console.log(walls.size);
   //   console.log(foods.size);
   //  console.log(ghosts.size);
   update();
   document.addEventListener("keyup", movePacman);
 }

//X = wall, O = skip, P = pac man, ' ' = food
//Ghosts: b = blue, o = orange, p = pink, r = red
const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;


   function loadImages(){
      wallImage = new Image();
      wallImage.src = "./images/wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "./images/blueGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "./images/orangeGhost.png";

    pinkGhostImage = new Image();
    pinkGhostImage.src = "./images/pinkGhost.png";

    redGhostImage = new Image();
    redGhostImage.src = "./images/redGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "./images/pacmanUp.png";

    pacmanDownImage = new Image();
    pacmanDownImage.src = "./images/pacmanDown.png";

    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./images/pacmanLeft.png";

    pacmanRightImage = new Image();
    pacmanRightImage.src = "./images/pacmanRight.png";

   }
   

    

class Block {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;

    }

    updateDirection(Direction){
        this.direction = Direction;
        this.updateVelocity();
    }

      updateVelocity(){
         if(this.direction == 'U'){
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
         }
         else if(this.direction == 'D'){
            this.velocityX = 0;
            this.velocityY = tileSize/4;
         }
         else if(this.direction == 'L'){
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
         }
         else if(this.direction == 'R'){
            this.velocityX = tileSize/4;
            this.velocityY = 0;
         }
      }
}

class Ghost {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }
}

class Pacman {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = pacmanRightImage;
    }
}

   

 function loadMap(){
   walls.clear();
   foods.clear();
   ghosts.clear();

   for(let r = 0; r < rowCount; r++){
      for(let c = 0; c < columnCount; c++){
         const row = tileMap[r];
         const tileMapChar = row[c];

         const x = c * tileSize;
         const y = r * tileSize;
         if(tileMapChar == "X"){
            const wall = new Block(x, y, tileSize, tileSize);
            walls.add(wall);
         }
         else if(tileMapChar == "b"){ //blueGhost
            const ghost = new Ghost(x, y, tileSize, tileSize, blueGhostImage);
            ghosts.add(ghost);
         }
         else if(tileMapChar == "o"){ //orangeGhost
            const ghost = new Ghost(x, y, tileSize, tileSize, orangeGhostImage);
            ghosts.add(ghost);
         }
         else if(tileMapChar == "p"){ //pinkGhost
            const ghost = new Ghost(x, y, tileSize, tileSize, pinkGhostImage);
            ghosts.add(ghost);
         }
         else if(tileMapChar == "r"){ //redGhost
            const ghost = new Ghost(x, y, tileSize, tileSize, redGhostImage);
            ghosts.add(ghost);
         }
         else if(tileMapChar == "P"){ //pacman
            pacman = new Pacman(x, y, tileSize, tileSize);
         }
         else if(tileMapChar == " "){ //food
            const food = new Block( x + 14, y + 14, 4, 4);
            foods.add(food);
         
      }
   }

   
   }}
 function update(){
   move();
   draw();
   setTimeout(update, 50); // 20 FPS 1 -> 1000ms/20 = 50 
 }
   function draw() {
        context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
        for(let ghost of ghosts.values()){
         context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
        }
        for(let wall of walls.values()){
        context.drawImage(wallImage, wall.x, wall.y, wall.width, wall.height);

        }

    context.fillStyle = "white";
    for(let food of foods.values()){
        context.fillRect(food.x, food.y, food.width, food.height);
    }


   }
   
   function move(){
      pacman.x += pacman.velocityX;
      pacman.y += pacman.velocityY;
   }

   function movePacman(e){
     if(e.code == "ArrowUp" || e.code == "KeyW"){
         pacman.updateDirection('U'); 
     }
       else if(e.code == "ArrowDown" || e.code == "KeyS"){
         pacman.updateDirection('D');
   }
   else if(e.code == "ArrowLeft" || e.code == "KeyA"){
         pacman.updateDirection('L');
}
   else if(e.code == "ArrowRight" || e.code == "KeyD"){
         pacman.updateDirection('R');
   }}