var Interface = function (draw) {
    var c = new PIXI.Container();
    c.width = 42;
    c.height = 42;
    c.scale = new PIXI.Point(1, 1);
    c.renderable = false;

    var mask = new PIXI.Graphics();
    mask.beginFill(0xFFFFFF);
    mask.drawRect(3, 3, 36, 36);
    c.addChild(mask);

    var e = draw.sprite(PIXI.Texture.fromImage('/sprites/e_btn.png'));
    e.width = 42;
    e.height = 42;
    c.addChild(e);

    position(c);
    draw.addGlobal(c);
    Looper.add(this);

    var scale_speed = 0.005;
    this.loop = function (timestamp, delta) {
        c.scale.x += scale_speed;
        c.scale.y += scale_speed;
        if (c.scale.x > 1.1) {
            scale_speed *= -1;
        }
        if (c.scale.x < 1) {
            scale_speed *= -1;
        }
    };

    this.hide = function () {
        c.renderable = false;
    };

    this.show = function () {
        c.renderable = true;
    };

    function position(sprite) {
        sprite.position.x = Draw.width - sprite.width - 15;
        sprite.position.y = Draw.height - sprite.height - 15;
    }
};