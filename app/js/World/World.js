var World = function (draw, main) {
    var world = this;
    this.draw = draw;
    this.physics = new Physics(draw);
    this.Loader = new Load(this, main);
    this.tileContainer = {};
    this.objects = [];
    this.triggers = [];
    var empty = true;

    Looper.add(this);

    this.addObject = function (obj) {
        obj.zIndex = obj.position.y + obj.height;
        draw.add(obj);
        draw.updateZIndex();
        this.objects.push(obj);
    };

    this.getSprite = function (texture, x, y) {
        var sprite = draw.sprite(texture);
        sprite.position.x = x;
        sprite.position.y = y;
        return sprite;
    };

    this.addTrigger = function (x, y, w, h) {
        var rect = new Rectangle(x, y, w, h);
        this.triggers.push(rect);
        rect.complite = false;
        rect.enable = true;
        return rect;
    };

    this.addTile = function (name, texture, position) {
        if (!this.tileContainer[name]) {
            this.tileContainer[name] = new PIXI.ParticleContainer(40000, {}, 40000);
            this.tileContainer[name].zIndex = -10000;
            draw.add(this.tileContainer[name]);
            draw.updateZIndex();
        }
        var sprite = draw.sprite(texture);
        sprite.position.x = position.x;
        sprite.position.y = position.y;
        this.tileContainer[name].zIndex = -1000 * 1000;
        draw.add(sprite, this.tileContainer[name]);
    };

    this.loop = function (timestamp, delta) {
        this.physics.loop(timestamp, delta);
        this.triggers.forEach(function (trigger) {
            if(main.player.entity.rectangle.getActualRectangle().isCollision(trigger)){
                if(trigger.enable && !trigger.complite){
                    if(trigger.trigger){
                        trigger.trigger.call();
                    }
                }
                trigger.complite = true;
            } else{
                if(trigger.complite && trigger.trigger && trigger.trigger.out){
                    trigger.trigger.out();
                }
                trigger.complite = false;
            }
        });
    };

    this.clearWorld = function () {
        if(!empty) {
            for (var key in this.tileContainer) {
                draw.remove(this.tileContainer[key]);
                delete this.tileContainer[key];
            }
            world.physics.clear();
            world.triggers = [];
            world.objects.forEach(function (obj) {
                draw.remove(obj);
            })
        }
        empty = false;
    };

    Camera.single.center(0, 0, 32, 32);

    world.Loader.load('/maps/test.json');
};