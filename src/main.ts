import { DIMENSIONS, SPEED } from "./constants";
import "./style.css";
import { Sprite } from "./classes/Sprite";
import getRandomArbitrary from "./utils/randomNumberGenerator";
import clamp from "./utils/clamp";
import playerSprite from "./assets/11.png";
import obstacleSprite from "./assets/car-sprite.png";

// start screen
const main = document.querySelector("main") as HTMLElement;
const startScreen = document.querySelector(".start-screen") as HTMLElement;
const startButton = document.querySelector(
     "#start-button"
) as HTMLButtonElement;

// hiding game screen initially
main.style.display = "none";

startButton.addEventListener("click", () => {
     main.style.display = "flex";
     Game();
     startScreen.style.display = "none";
});

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let score = 0;
const scoreSpan = document.getElementById("score")!;

let myReq: number;
let gameOver = false;

canvas.width = DIMENSIONS.CANVAS_WIDTH;
canvas.height = DIMENSIONS.CANVAS_HEIGHT;
const middleLane = DIMENSIONS.CANVAS_WIDTH / 2 - DIMENSIONS.CAR_WIDTH / 2;
const leftLane = middleLane - DIMENSIONS.CANVAS_WIDTH / 3;
const rightLane = middleLane + DIMENSIONS.CANVAS_WIDTH / 3;

function Game() {
     scoreSpan.innerHTML = String(score);
     const playerCar = new Sprite(
          playerSprite,
          middleLane,
          DIMENSIONS.CANVAS_HEIGHT - DIMENSIONS.CAR_HEIGHT - 30,
          DIMENSIONS.CAR_WIDTH,
          DIMENSIONS.CAR_HEIGHT
     );
     const car1 = new Sprite(
          obstacleSprite,
          leftLane,
          -800,
          DIMENSIONS.CAR_WIDTH,
          DIMENSIONS.CAR_HEIGHT
     );
     const car2 = new Sprite(
          obstacleSprite,
          rightLane,
          0,
          DIMENSIONS.CAR_WIDTH,
          DIMENSIONS.CAR_HEIGHT
     );
     const car3 = new Sprite(
          obstacleSprite,
          middleLane,
          -100,
          DIMENSIONS.CAR_WIDTH,
          DIMENSIONS.CAR_HEIGHT
     );
     const carArr = [car1, car2, car3];
     let gameSpeed = SPEED.OBSTACLE_SPEED;

     // newly generated position with positions of other cars to ensure fair obstacle generation
     function generateNewPosition(car: Sprite) {
          let newPosition = getRandomArbitrary(-500, 0);
          carArr.forEach((el) => {
               if (Math.abs(newPosition - el.y) < DIMENSIONS.CAR_HEIGHT * 3) {
                    newPosition -= DIMENSIONS.CAR_HEIGHT * 3;
               }
          });
          car.y = newPosition;
     }

     // increments score and obstacle speed
     function updateGameState() {
          gameSpeed += 0.2;
          console.log(gameSpeed);
          score++;
          scoreSpan.innerHTML = String(score);
     }

     function animatePlayer() {
          ctx.drawImage(
               playerCar.image,
               playerCar.x,
               playerCar.y,
               playerCar.width,
               playerCar.height
          );

          if (playerCar.x < playerCar.targetX) {
               playerCar.x = Math.min(
                    playerCar.x + SPEED.PLAYER_SPEED,
                    playerCar.targetX
               );
          } else if (playerCar.x > playerCar.targetX) {
               playerCar.x = Math.max(
                    playerCar.x - SPEED.PLAYER_SPEED,
                    playerCar.targetX
               );
          }
     }

     function resetGame() {
          gameOver = false;
          gameSpeed = SPEED.OBSTACLE_SPEED;
          score = 0;
          const gameOverScreen = document.querySelector(
               ".gameover-screen"
          ) as HTMLDivElement;
          gameOverScreen.style.display = "none";
          Game();
     }

     function handleGameOver() {
          // displying game over screeen
          const gameOverScreen = document.querySelector(
               ".gameover-screen"
          ) as HTMLDivElement;
          gameOverScreen.style.display = "flex";

          // displaying score
          (document.querySelector("#final-score") as HTMLElement).innerHTML =
               String(score);

          const playAgainBtn = document.querySelector(
               "#play-again"
          ) as HTMLButtonElement;
          playAgainBtn.addEventListener("click", () => {
               resetGame();
          });
     }

     function draw() {
          ctx.clearRect(
               0,
               0,
               DIMENSIONS.CANVAS_WIDTH,
               DIMENSIONS.CANVAS_HEIGHT
          );
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, DIMENSIONS.CANVAS_WIDTH, DIMENSIONS.CANVAS_HEIGHT);

          carArr.forEach((car) => {
               ctx.drawImage(car.image, car.x, car.y, car.width, car.height);
               if (playerCar.isColliding(car)) {
                    gameOver = true;
               }
               car.y += clamp(gameSpeed, 0, SPEED.MAX_SPEED);

               // car reaches bottom
               if (car.y > DIMENSIONS.CANVAS_HEIGHT) {
                    updateGameState();
                    generateNewPosition(car);
               }
          });

          animatePlayer();

          if (gameOver) {
               cancelAnimationFrame(myReq);
               handleGameOver();
               return;
          }
          myReq = requestAnimationFrame(draw);
     }

     draw();

     window.addEventListener("keydown", (event) => {
          switch (event.key) {
               case "a": {
                    if (playerCar.x >= middleLane) {
                         playerCar.setTarget(
                              playerCar.x - DIMENSIONS.CANVAS_WIDTH / 3
                         );
                    }
                    break;
               }

               case "d": {
                    if (playerCar.x <= middleLane) {
                         playerCar.setTarget(
                              playerCar.x + DIMENSIONS.CANVAS_WIDTH / 3
                         );
                    }
                    break;
               }
          }
     });
}
