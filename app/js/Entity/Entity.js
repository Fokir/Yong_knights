var Entity = function (draw, world) {
    this.collision = true;
    this.sprite = null;
    this.isAnimate = false;
    this.animations = {};
    this.curentAnimation = null;
    this.timeLife = false;
    this.health = false;
    this.isAI = false;
    this.AI = new AI(this);
    this.rectangle = new Rectangle(0, 0, 0, 0);
    this.body = null;
    this.updateSprite = null;

    this.rotation = 0;

    this.setAI = function (behavior) {
        this.AI.behavior(behavior);
        this.isAI = !!behavior;
    };

    this.setAnimation = function (name, textures) {
        this.animations[name] = draw.movie(textures);
        this.animations[name].renderable = false;
        this.animations[name].play();
        this.animations[name].animationSpeed = 0.15;
        this.animations[name].zIndex = 1;
        draw.add(this.animations[name]);
        draw.updateZIndex();
        this.isAnimate = true;
    };

    this.playAnimation = function (name) {
        if (this.isAnimate) {
            if (this.curentAnimation) {
                this.curentAnimation.renderable = false;
            }
            this.animations[name].renderable = true;
            this.curentAnimation = this.animations[name];
        }
    };

    this.setSprite = function (texture) {
        this.sprite = draw.sprite(texture);
    };

    this.setTimeLife = function (time) {
        this.timeLife = time;
    };

    this.kill = function () {
        if (this.sprite) {
            draw.remove(this.sprite);
        }
        if (this.isAnimate) {
            for (var key in this.animations) {
                var animation = this.animations[key];
                draw.remove(animation);
            }
        }
    };

    this.getSprite = function () {
        if (this.isAnimate) {
            return this.curentAnimation
        } else {
            return this.sprite;
        }
    };

    this.move = function (x, y, delta) {
        if (this.body) {
            Matter.Body.translate(this.body, {
                x: x * delta * -1,
                y: y * delta * -1
            });
        } else {
            this.rectangle.x -= x * delta;
            this.rectangle.y -= y * delta;
        }
    };

    var lastZIndex = 0;
    this.zIndex = function () {
        this.curentAnimation.zIndex = this.rectangle.y + this.rectangle.h;
        if(lastZIndex != this.curentAnimation.zIndex){
            draw.updateZIndex();
            lastZIndex = this.curentAnimation.zIndex;
        }
    };

    this.setPosition = function (x, y) {
        Matter.Body.setPosition(this.body, {
            x: x,
            y: y
        });
    };

    this.addBody = function (w, h, isStatic, remove) {
        this.body = world.physics.add(this.getSprite(), this.rectangle.getActualRectangle().x,
            this.rectangle.getActualRectangle().y, w, h, isStatic, remove);
    };

    this.loop = function (timestamp, delta) {
        var self = this;
        if (this.isAI) {
            this.AI.loop(function (x, y) {
                self.position.x += x * delta;
                self.position.y += y * delta;
            });
        }

        var sprite = this.getSprite();
        if (this.updateSprite instanceof Function) {
            this.updateSprite(sprite, this.body, this.rectangle);
        }
        if (sprite) {
            sprite.position.x = this.rectangle.x;
            sprite.position.y = this.rectangle.y;
            this.zIndex();
        }

        if(this.timeLife !== false){
            this.timeLife -= timestamp;
        }
        if ((this.timeLife < 0 && this.timeLife !== false) || (this.health <= 0 && this.health !== false)) {
            this.kill();
        }
    }
};