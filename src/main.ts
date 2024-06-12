import { DIMENSIONS, SPEED } from "./constants";
import "./style.css";
import { Sprite } from "./classes/Sprite";
import { Rectangle } from "./classes/Rectangle";
import getRandomArbitrary from "./utils/randomNumberGenerator";
import clamp from "./utils/clamp";
import playerSprite from "./assets/11.png";
import obstacleSprite from "./assets/car-sprite.png";
import fireballSprite from "./assets/Yellow fire icon.png";

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
let bulletCount = 2;
const scoreSpan = document.getElementById("score")!;
const bulletCountSpan = document.getElementById("bullet")!;

let myReq: number;
let gameOver = false;

canvas.width = DIMENSIONS.CANVAS_WIDTH;
canvas.height = DIMENSIONS.CANVAS_HEIGHT;
const middleLane = DIMENSIONS.CANVAS_WIDTH / 2 - DIMENSIONS.CAR_WIDTH / 2;
const leftLane = middleLane - DIMENSIONS.CANVAS_WIDTH / 3;
const rightLane = middleLane + DIMENSIONS.CANVAS_WIDTH / 3;
const leftDivider = DIMENSIONS.CANVAS_WIDTH / 3 - DIMENSIONS.DIVIDER_WIDTH;
const rightDivider =
     DIMENSIONS.CANVAS_WIDTH -
     DIMENSIONS.CANVAS_WIDTH / 3 -
     DIMENSIONS.DIVIDER_WIDTH;

function Game() {
     scoreSpan.innerHTML = String(score);
     bulletCountSpan.innerHTML = String(bulletCount);
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
     let bulletFired = false;
     let bulletFiredArr: Sprite[] = [];
     const divider1 = new Rectangle(leftDivider, 0);
     const divider2 = new Rectangle(leftDivider, DIMENSIONS.DIVIDER_GAP);
     const divider3 = new Rectangle(leftDivider, DIMENSIONS.DIVIDER_GAP * 2);
     const divider4 = new Rectangle(leftDivider, DIMENSIONS.DIVIDER_GAP * -1);
     const divider5 = new Rectangle(rightDivider, 0);
     const divider6 = new Rectangle(rightDivider, DIMENSIONS.DIVIDER_GAP);
     const divider7 = new Rectangle(rightDivider, DIMENSIONS.DIVIDER_GAP * 2);
     const divider8 = new Rectangle(rightDivider, DIMENSIONS.DIVIDER_GAP * -1);
     const dividerArr = [
          divider1,
          divider2,
          divider3,
          divider4,
          divider5,
          divider6,
          divider7,
          divider8,
     ];

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
          bulletCount = 2;
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

     function animateLane() {
          dividerArr.forEach((divider) => {
               ctx.fillStyle = "#fafafa";
               ctx.fillRect(
                    divider.x,
                    divider.y,
                    divider.width,
                    divider.height
               );
               divider.y += SPEED.DIVIDER_SPEED;
               if (divider.y > DIMENSIONS.CANVAS_HEIGHT) {
                    divider.y = -150;
               }
          });
     }

     function createBullet() {
          if (bulletCount > 0) {
               bulletCount--;
               bulletCountSpan.innerHTML = String(bulletCount);
               const fireball = new Sprite(
                    fireballSprite,
                    playerCar.x + DIMENSIONS.BULLET_WIDTH / 2,
                    playerCar.y - DIMENSIONS.BULLET_HEIGHT,
                    DIMENSIONS.BULLET_WIDTH,
                    DIMENSIONS.BULLET_HEIGHT
               );
               bulletFiredArr.push(fireball);
          }
     }

     function checkBulletCollisoin(bullet: Sprite) {
          carArr.forEach((car) => {
               if (
                    bullet.x < car.x + car.width &&
                    bullet.x + bullet.width > car.x &&
                    bullet.y < car.y + car.height &&
                    bullet.y + bullet.height > car.y
               ) {
                    score++;
                    scoreSpan.innerHTML = String(score);

                    bulletFiredArr = bulletFiredArr.filter(
                         (el) => el !== bullet
                    );
                    generateNewPosition(car);
               }
          });
     }

     function handleBulletFired() {
          if (bulletFired) {
               bulletFiredArr.forEach((bullet) => {
                    ctx.drawImage(
                         bullet.image,
                         bullet.x,
                         bullet.y,
                         bullet.width,
                         bullet.height
                    );
                    bullet.y -= SPEED.BULLET_SPEED;
                    checkBulletCollisoin(bullet);
               });
          }
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

          animateLane();

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
          handleBulletFired();

          if (gameOver) {
               cancelAnimationFrame(myReq);
               handleGameOver();
               return;
          }
          myReq = requestAnimationFrame(draw);
     }

     draw();

     window.addEventListener("keydown", (event) => {
          console.log(event.key);

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
               case "w": {
                    bulletFired = true;
                    createBullet();
               }
          }
     });
}
