var World = function (draw, main) {
    var world = this;
    this.draw = draw;
    this.physics = new Physics(draw);
    this.Loader = new Load(this, main);
    this.tileContainer = null;
    this.tileMap = null;
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

    this.startTileGenerate = function () {
        this.tileContainer = new PIXI.Container();
    };

    this.addTile = function (name, texture, position) {
        var sprite = draw.sprite(texture);
        sprite.position.x = position.x;
        sprite.position.y = position.y;
        draw.add(sprite, this.tileContainer);
    };

    this.endTileGenerate = function (width, height) {
        var renderTexture = new PIXI.RenderTexture(draw.renderer, width, height);
        renderTexture.render(this.tileContainer);
        this.tileMap = new PIXI.Sprite(renderTexture);
        draw.add(this.tileMap);
    };

    this.loop = function (timestamp, delta) {
        this.physics.loop(timestamp, delta);
        this.triggers.forEach(function (trigger) {
            if (main.player.entity.rectangle.getActualRectangle().isCollision(trigger)) {
                if (trigger.enable && !trigger.complite) {
                    if (trigger.trigger) {
                        trigger.trigger.call();
                    }
                }
                trigger.complite = true;
            } else {
                if (trigger.complite && trigger.trigger && trigger.trigger.out) {
                    trigger.trigger.out();
                }
                trigger.complite = false;
            }
        });
    };

    this.clearWorld = function () {
        if (!empty) {
            if(this.tileMap){
                draw.remove(this.tileMap);
                this.tileContainer = null;
                this.tileMap = null;
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