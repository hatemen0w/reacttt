
class Graph {
    constructor({
        id = 'canvas',
        WIN,
        width = 500,
        height = 500,
        callbacks
    }) {
        if (id) {
            this.canvas = document.getElementById(id);
        } else {
            this.canvas = document.createElement('canvas');
            document.querySelector('body').appendChild(this.canvas);
        }
        this.WIN = WIN;
        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx = this.canvas.getContext('2d');

        this.PI2 = Math.PI * 2;

        if (callbacks) {
            this.canvas.addEventListener('wheel', callbacks.wheel);
            this.canvas.addEventListener('mousemove', callbacks.mousemove);
            this.canvas.addEventListener('mousedown', callbacks.mousedown);
            this.canvas.addEventListener('mouseup', callbacks.mouseup);
            this.canvas.addEventListener('mouseout', callbacks.mouseout);
        }
        this.canvas.addEventListener('contextmenu', (event) => event.preventDefault());

        this.canvasV = document.createElement('canvas');
        this.canvasV.width = width;
        this.canvasV.height = height;
        this.ctxV = this.canvasV.getContext('2d');
    }

    xs(x) {
        return (this.canvas.width * (x - this.WIN.LEFT) / this.WIN.WIDTH);
    }

    ys(y) {
        return (this.canvas.height - (this.canvas.height * (y - this.WIN.BOTTOM) / this.WIN.HEIGHT));
    }

    sx(x) {
        return x * this.WIN.WIDTH / this.canvas.width;
    }

    sy(y) {
        return -y * this.WIN.HEIGHT / this.canvas.height;
    }

    clear() {
        this.ctxV.fillStyle = 'white';
        this.ctxV.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    line(x1, y1, x2, y2, color = 'black', width = 0.5, isDash = false) {
        this.ctxV.beginPath();
        this.ctxV.strokeStyle = color;
        this.ctxV.lineWidth = width || 3;
        if (isDash) {
            this.ctxV.setLineDash([10, 10]);
        }
        else {
            this.ctxV.setLineDash([0, 0]);
        }
        this.ctxV.moveTo(this.xs(x1), this.ys(y1));
        this.ctxV.lineTo(this.xs(x2), this.ys(y2));
        this.ctxV.closePath();
        this.ctxV.stroke();
    }

    text(text, x, y, color, size, font) {
        this.ctxV.beginPath();
        font = font || 'Arial';
        size = size || "12";
        this.ctxV.font = size + "px " + font;
        this.ctxV.fillStyle = color || 'black';
        this.ctxV.closePath();
        this.ctxV.fillText(text, this.xs(x), this.ys(y));
    }

    point(x, y, color, size = 1) {
        this.ctxV.beginPath();
        this.ctxV.lineWidth = size;
        this.ctxV.strokeStyle = color || 'black';
        this.ctxV.arc(this.xs(x), this.ys(y), size, 0, this.PI2);
        this.ctxV.closePath();
        this.ctxV.stroke();
    }

    pointLite(x, y, color, size = 1.8) {
        this.ctxV.beginPath();
        this.ctxV.lineWidth = size;
        this.ctxV.strokeStyle = color || 'black';
        this.ctxV.moveTo(this.xs(x) - size / 2, this.ys(y) - size / 2);
        this.ctxV.lineTo(this.xs(x) + size / 2, this.ys(y) - size / 2);
        this.ctxV.lineTo(this.xs(x) + size / 2, this.ys(y) + size / 2);
        this.ctxV.lineTo(this.xs(x) - size / 2, this.ys(y) + size / 2);
        this.ctxV.lineTo(this.xs(x) - size / 2, this.ys(y) - size / 2);
        this.ctxV.closePath();
        this.ctxV.stroke();
    }

    polygon(points, color) {
        this.ctxV.beginPath();
        this.ctxV.strokeStyle = color || '#000000';
        this.ctxV.fillStyle = color || '#000000';
        this.ctxV.lineWidth = 0.1;
        if (points.length > 2) {
            this.ctxV.moveTo(this.xs(points[0].x), this.ys(points[0].y));
            for (let i = 1; i < points.length; i++) {
                this.ctxV.lineTo(this.xs(points[i].x), this.ys(points[i].y));
            }
            this.ctxV.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        }
        this.ctxV.closePath();
        this.ctxV.fill();
        this.ctxV.stroke();
    }

    drawSun(x, y) {
        this.ctxV.beginPath();
        const size = 10;
        this.ctxV.lineWidth = 2;
        this.ctxV.strokeStyle = 'yellow';
        this.ctxV.moveTo(this.xs(x) - size / 2, this.ys(y));
        this.ctxV.lineTo(this.xs(x) - size / 5, this.ys(y) + size / 5);
        this.ctxV.lineTo(this.xs(x), this.ys(y) + size / 2);
        this.ctxV.lineTo(this.xs(x) + size / 5, this.ys(y) + size / 5);
        this.ctxV.lineTo(this.xs(x) + size / 2, this.ys(y));
        this.ctxV.lineTo(this.xs(x) + size / 5, this.ys(y) - size / 5);
        this.ctxV.lineTo(this.xs(x), this.ys(y) - size / 2);
        this.ctxV.lineTo(this.xs(x) - size / 5, this.ys(y) - size / 5);
        this.ctxV.lineTo(this.xs(x) - size / 2, this.ys(y));
        this.ctxV.closePath();
        this.ctxV.stroke();
    }

    renderFrame() {
        this.ctx.drawImage(this.canvasV, 0, 0);
    }
}

export default Graph;