var Draw = function () {
    var world = new PIXI.Container();
    var global = new PIXI.Container();
    var camera = new Camera(world);
    global.addChild(camera.get());

    function size() {
        var myWidth = 0, myHeight = 0;
        if (typeof( window.innerWidth ) == 'number') {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if (document.documentElement && ( document.documentElement.clientWidth ||
            document.documentElement.clientHeight )) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }
        return {
            w: myWidth,
            h: myHeight
        };
    }

    Draw.width = size().w;
    Draw.height = size().h;

    var renderer = new PIXI.autoDetectRenderer(Draw.width, Draw.height, {
        view: document.getElementById('game')
    });
    var amount = (renderer instanceof PIXI.WebGLRenderer) ? 100 : 5;
    if (amount == 5) {
        renderer.context.mozImageSmoothingEnabled = false;
        renderer.context.webkitImageSmoothingEnabled = false;
    }

    document.body.appendChild(renderer.view);
    world.updateLayersOrder = function () {
        world.children.sort(function (a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return a.zIndex - b.zIndex
        });
    };

    this.draw = function () {
        world.updateLayersOrder();
        renderer.render(global);
    };

    this.sprite = function (texture) {
        return new PIXI.Sprite(texture);
    };

    this.movie = function (textures) {
        return new PIXI.extras.MovieClip(textures);
    };

    this.remove = function (obj) {
        world.removeChild(obj);
    };

    this.add = function (sprite, target) {
        if (!target) {
            target = world;
        }
        target.addChild(sprite);
    };

    this.addGlobal = function (sprite) {
        global.addChild(sprite);
    };

    this.camera = function (x, y, w, h) {
        camera.center(x, y, w, h);
    };

    this.preloader = new Preloader(this);
    Physics.init(this);
};