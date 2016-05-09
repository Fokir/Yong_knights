var Physics = function (draw) {
    var Engine = Matter.Engine;
    var engine = Engine.create();
    engine.world.gravity.y = 0;
    this.engine = engine;

    this._debug = new PIXI.Graphics();
    this._debug.zIndex = 1000000;
    draw.add(this._debug);
    draw.updateZIndex();
    this.debug = false;
    window.Physics = this;

    this.list = [];
};

Physics.prototype.clear = function () {
    var self = this;
    this.list.forEach(function (obj) {
        Matter.Composite.remove(self.engine.world, obj);
    });
    this.list = [];
};

Physics.prototype.add = function (sprite, x, y, w, h, isStatic, noRemove) {
    var Bodies = Matter.Bodies,
        World = Matter.World;

    x += w / 2;
    y += h / 2;

    var obj = Bodies.rectangle(x, y, w, h, {isStatic: !!isStatic});
    obj.sprite = sprite;
    World.add(this.engine.world, [obj]);
    if(!noRemove){
        this.list.push(obj);
    }
    return obj;
};

Physics.prototype.loop = function (timestamp, delta) {
    var Engine = Matter.Engine;
    Engine.update(this.engine, 1000 / 60);
    var self = this;
    this._debug.clear();
    this._debug.beginFill(0xFFFFFF);
    this._debug.alpha = 0.3;
    var Composite = Matter.Composite;
    var bodies = Composite.allBodies(this.engine.world);
    bodies.forEach(function (body) {
        if (body.sprite) {
            body.sprite.position = body.position;
        }

        if (self.debug) {
            var vertices = body.vertices;
            self._debug.moveTo(vertices[0].x, vertices[0].y);
            for (var j = 1; j < vertices.length; j += 1) {
                self._debug.lineTo(vertices[j].x, vertices[j].y);
            }

            self._debug.lineTo(vertices[0].x, vertices[0].y);
        }
    });
};

