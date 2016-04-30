function Main() {
    var draw = new Draw(this);
    var lastTimestamp = 0;

    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    this.player = new Player(draw, 'rain');
    this.world = new World(draw, this);

    var loop = function (timestamp) {
        stats.begin();

        var delta = 1 / (1000 / (timestamp - lastTimestamp));
        lastTimestamp = timestamp;

        Looper.loop(timestamp - lastTimestamp, delta);
        Physics.loop(timestamp - lastTimestamp, delta);

        draw.draw(delta);

        stats.end();

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}

var Looper = {
    count: 0,
    _loope: [],
    add: function (obj) {
        this._loope.push(obj);
    },
    loop: function (timestamp, delta) {
        this._loope.forEach(function (obj) {
            obj.loop(timestamp, delta);
        });
        this.count++;
    }
};

window.onload = function () {
    new Main();
};