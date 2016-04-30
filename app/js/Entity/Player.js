var Player = function (draw, name, nick, behavior) {
    this.entity = new Entity(draw);
    this.entity.position.__permanent__ = true;
    this.entity.position.w = Config.player.width;
    this.entity.position.h = Config.player.height;

    //Настройки для расчета столкновений
    var widthCollision = 16;
    var heightCollision = 15;
    this.entity.position.collisionOffset.h = heightCollision;
    this.entity.position.collisionOffset.y = Config.player.height - heightCollision;
    this.entity.position.collisionOffset.w = Config.player.width - widthCollision;
    this.entity.position.collisionOffset.x = widthCollision / 2;

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

        draw.camera(this.entity.position.x, this.entity.position.y, Config.player.width, Config.player.height);

        player.entity.playAnimation(animation);
        this.entity.loop(timestamp, delta);
    }
};