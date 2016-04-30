var Entity = function (draw) {
    this.collision = true;
    this.sprite = null;
    this.isAnimate = false;
    this.animations = {};
    this.curentAnimation = null;
    this.timeLife = false;
    this.health = false;
    this.isAI = false;
    this.AI = new AI(this);
    this.position = new Rectangle(0, 0, 0, 0);
    Physics.add(this.position, false);

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
            this.animations.forEach(function (animation) {
                draw.remove(animation);
            });
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
        this.position.x -= x * delta;
        this.position.y -= y * delta;
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
        if (sprite) {
            sprite.position.x = this.position.x;
            sprite.position.y = this.position.y;
        }

        this.timeLife -= timestamp;
        if ((this.timeLife < 0 && this.timeLife !== false) || (this.health <= 0 && this.health !== false)) {
            this.kill();
        }
    }
};