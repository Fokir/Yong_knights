var Rectangle = function (x, y, w, h) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;

    var lastX = x;
    var lastY = y;

    this.loop = function () {
        lastX = this.x;
        lastY = this.y;
    };
    
    this.cancelX = function () {
        this.x = lastX;
    };

    this.cancelY = function () {
        this.y = lastY;
    };

    this.collisionOffset = {
        x: 0,
        y: 0,
        w: false,
        h: false
    };

    this.getActualRectangle = function () {
        return new Rectangle(this.x + this.collisionOffset.x, this.y + this.collisionOffset.y,
            this.collisionOffset.w || this.w, this.collisionOffset.h || this.h)
    };

    this.setActualX = function (x) {
        this.x = x - this.collisionOffset.x;
    };

    this.setActualY = function (y) {
        this.y = y - this.collisionOffset.y;
    };

    this.centerPoint = function () {
        return {
            x: x + w / 2,
            y: y + h / 2
        }
    };

    this.isCollision = function (rect) {
        return this.x < rect.x + rect.w && this.x + this.w > rect.x &&
            this.y < rect.y + rect.h && this.h + this.y > rect.y
    }
};