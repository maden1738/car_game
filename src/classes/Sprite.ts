interface ISprite {
     image: HTMLImageElement;
     x: number;
     y: number;
     width: number;
     height: number;
     targetX: number;
}

export class Sprite implements ISprite {
     image: HTMLImageElement;
     x: number;
     y: number;
     width: number;
     height: number;
     targetX: number;

     constructor(
          imagePath: string,
          x: number,
          y: number,
          width: number,
          height: number
     ) {
          this.image = new Image();
          this.image.src = imagePath;
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.targetX = x;
     }

     isColliding(obstacle: Sprite) {
          if (
               this.x < obstacle.x + obstacle.width &&
               this.x + this.width > obstacle.x &&
               this.y < obstacle.y + obstacle.height &&
               this.y + this.height > obstacle.y
          ) {
               return true;
          }
          return false;
     }

     setTarget(x: number) {
          this.targetX = x;
     }
}
