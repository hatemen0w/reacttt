import Point from "./Point";

class Light extends Point {
    constructor(x, y, z, lumen = 1500) {
        super(x, y, z);
        this.lumen = lumen;
    }
}

export default Light;