import Point from "./Point";

class Surface {
    constructor(points = [], edges = [], polygons = [], center = new Point(), bulge = true) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.center = center;
        this.bulge = bulge;
        this.animations = [];
    }

    clearAnimations() {
        this.animations = [];
    }

    addAnimation(method, value, center) {
        this.animations.push({ method, value, center });
    }

    doAnimation(math3D) {
        this.animations.forEach(animation => {
            const T1 = math3D.getMoveT(-animation.center.x, -animation.center.y, -animation.center.z);
            const T2 = math3D[animation.method](animation.value);
            const T3 = math3D.getMoveT(animation.center.x, animation.center.y, animation.center.z)
            const matrix = math3D.getTransform(T1, T2, T3);
            math3D.transformPoint(this.center, matrix);
            this.points.forEach(point => math3D.transformPoint(point, matrix));
        });
    }
}

export default Surface;