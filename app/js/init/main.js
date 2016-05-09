function Main() {
    var draw = new Draw(this);
    var lastTimestamp = 0;

    var stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    this.world = new World(draw, this);
    this.player = new Player(draw, this.world, 'rain');
    this.interface = new Interface(draw);

    Dialog.init(this.world, draw, this);

    var loop = function (timestamp) {
        stats.begin();
        var delta = 1 / (1000 / (timestamp - lastTimestamp));
        lastTimestamp = timestamp;
        Looper.loop(timestamp - lastTimestamp, delta);
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
var main;
window.onload = function () {
    main = new Main();
};