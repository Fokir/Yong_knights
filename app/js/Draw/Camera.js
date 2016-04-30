var Camera = function (world) {
    this.container = new PIXI.Container();
    this.container.addChild(world);
    var control = Keyboard();
    Camera.single = this;

    this.get = function () {
        return this.container;
    };

    this.up = function (i) {
        this.container.position.y -= i * window.delta;
    };

    this.down = function (i) {
        this.container.position.y += i * window.delta;
    };

    this.left = function (i) {
        this.container.position.x -= i * window.delta;
    };

    this.right = function (i) {
        this.container.position.x += i * window.delta;
    };

    this.move = function (x, y, delta) {
        this.container.position.x -= x * delta;
        this.container.position.y -= y * delta;
    };

    this.center = function (x, y, width, height) {
        this.container.position.x = x * -1 + (window.innerWidth / 2) - (width / 2);
        this.container.position.y = y * -1 + (window.innerHeight / 2) - (height / 2);
    };
};
