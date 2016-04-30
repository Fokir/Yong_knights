var Preloader = function (draw) {
    var bar = new PIXI.Graphics();
    bar.beginFill(0xFFFFFF);
    bar.alpha = 0.5;
    draw.addGlobal(bar);

    var progress = new PIXI.Graphics();
    progress.beginFill(0xFFFFFF);
    draw.addGlobal(progress);

    this.show = function () {
        bar.drawRect(0, Draw.height - 16, Draw.width, 16);
    };

    this.hide = function () {
        bar.clear();
        progress.clear();
    };

    this.step = function (i) {
        i /= 100;
        progress.drawRect(0, Draw.height - 16, Draw.width * i, 16);
    };

    this.stepCalc = function (i, n) {
        this.step((i/n)*100);
    };
};