var World = function (draw, main) {
    var world = this;
    var world = this;
    this.draw = draw;
    this.Loader = new Load(this, main);
    this.tileContainer = {};
    this.objectContainer = null;
    
    Looper.add(this);

    this.addObject = function (obj) {
        if(!this.objectContainer){
            this.objectContainer = new PIXI.Container();
            draw.add(obj);
        }
    };
    
    this.addTile = function (name, texture, position) {
        if(!this.tileContainer[name]){
            this.tileContainer[name] = new PIXI.ParticleContainer(40000, {}, 40000);
            draw.add(this.tileContainer[name]);
        }
        var sprite = draw.sprite(texture);
        sprite.position.x = position.x;
        sprite.position.y = position.y;
        this.tileContainer[name].zIndex = -1000 * 1000;

        draw.add(sprite, this.tileContainer[name]);
    };

    this.loop = function (timestamp, delta) {

    };

    this.clearWorld = function () {
        for(var key in this.tileContainer){
            draw.remove(this.tileContainer[key]);
            delete this.tileContainer[key];
        }
    };

    Camera.single.center(0, 0, 32, 32);

    this.Loader.load('/maps/big.json');
    setTimeout(function () {
        world.Loader.load('/maps/test.json');
    }, 15000)
};