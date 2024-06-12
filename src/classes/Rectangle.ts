import { DIMENSIONS } from "../constants";

interface IRectangle {
     x: number;
     y: number;
     width: number;
     height: number;
}

export class Rectangle implements IRectangle {
     x: number;
     y: number;
     width: number;
     height: number;

     constructor(
          x: number,
          y: number,
          width: number = DIMENSIONS.DIVIDER_WIDTH,
          height: number = DIMENSIONS.DIVIDER_HEIGHt
     ) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
     }
}
