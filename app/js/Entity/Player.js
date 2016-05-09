var Player = function (draw, world, name, nick, behavior) {
    this.entity = new Entity(draw, world);
    this.entity.rectangle.w = Config.player.width;
    this.entity.rectangle.h = Config.player.height;

    //Настройки для расчета столкновений
    var widthCollision = 20;
    var heightCollision = 15;
    this.entity.rectangle.collisionOffset.h = heightCollision;
    this.entity.rectangle.collisionOffset.y = Config.player.height - heightCollision;
    this.entity.rectangle.collisionOffset.w = Config.player.width - widthCollision;
    this.entity.rectangle.collisionOffset.x = widthCollision / 2;

    this.entity.updateSprite = function (sprite, body, rectangle) {
        if(sprite){
            rectangle.setActualX(body.position.x - this.rectangle.collisionOffset.w/2);
            rectangle.setActualY(body.position.y - this.rectangle.collisionOffset.h/2);
        }
    };

    this.initBody = function () {
        this.entity.addBody(this.entity.rectangle.collisionOffset.w, this.entity.rectangle.collisionOffset.h, false, true);
    };
    this.initBody();

    var player = this;
    Looper.add(this);

    var control = Keyboard(!behavior);

    if(name){
        axios.get('/sprites/npc/'+name+'/entity.json').then(function (response) {
            var res = response.data;
            PIXI.loader.add('/sprites/npc/'+name+'/'+res.name+'.json')
                .load(function () {
                    for(var n in res.animations){
                        var frames = [];
                        res.animations[n].forEach(function (e) {
                            frames.push(PIXI.Texture.fromFrame(e));
                        });
                        player.entity.setAnimation(n, frames);
                    }
                    player.entity.playAnimation('stay_down');
                });
        });
    }

    var animation = 'stay_down';
    this.loop = function (timestamp, delta) {
        if(this.entity.body){
            this.entity.rectangle.x = this.entity.body.position.x;
            this.entity.rectangle.y = this.entity.body.position.y;
        }
        if(control.is('w')){
            this.entity.move(0, Config.player.speed, delta);
            animation = 'up'
        }
        if(control.is('s')){
            this.entity.move(0, -1 * Config.player.speed, delta);
            animation = 'down';
        }

        if(control.is('w') && control.is('s')){
            animation = 'stay_down'
        }

        if(control.is('a')){
            this.entity.move(Config.player.speed, 0, delta);
            animation = 'left';
        }
        if(control.is('d')){
            this.entity.move(-1 * Config.player.speed, 0, delta);
            animation = 'right';
        }

        if(!control.is('d') && !control.is('a') && !control.is('w') && !control.is('s') &&
            animation.indexOf('stay_') == -1){
            animation = 'stay_'+animation;
        }

        if(control.is('a') && control.is('d') && !(control.is('w') || control.is('s') )){
            animation = 'stay_down'
        }

        draw.camera(this.entity.rectangle.x, this.entity.rectangle.y, Config.player.width, Config.player.height);

        player.entity.playAnimation(animation);
        this.entity.loop(timestamp, delta);
    }
};