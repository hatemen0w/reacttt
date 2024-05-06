class Polygon {
    constructor(points = [], color = '#444444') {
        this.points = points;
        this.color = this.hexToRgb(color);
        this.distance = null;
        this.lumen = null;
        this.center = null;
        this.norm = null;
        this.index = null;
        this.R = null;
        this.visibility = true;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 0, b: 0 };
    }

    rgbToHex(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    }
}

export default Polygon;