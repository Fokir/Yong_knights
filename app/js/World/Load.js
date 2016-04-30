var Load = function (world, main) {
    var self = this;
    Load.single = self;
    var cache = {};
    this.tileheight = 0;
    this.tilewidth = 0;

    this.load = function (url) {
        world.clearWorld();
        cache = {};
        world.draw.preloader.show();
        axios.get(url).then(function (response) {
            self.parse(response.data);
        });
    };

    this.parse = function (json) {
        self.tilewidth = json.tilewidth;
        self.tileheight = json.tileheight;
        self.spawnPoint = null;
        if(json.properties){
            self.spawnPoint = json.properties.spawn || null;
        }
        self.loadTextures(json.tilesets, function () {
            world.draw.preloader.hide();
            self.prepareLayers(json.layers);
        });
    };

    this.loadTextures = function (collection, callback) {
        var loader = new PIXI.loaders.Loader();
        collection.forEach(function (col) {
            var key;
            for (key in col.tiles) {
                var item = col.tiles[key];
                var path = '/sprites/' + item.image;
                loader.add(path, path);
            }
        });

        loader.watch('progress', function (name, o, n) {
            world.draw.preloader.step(loader.progress);
            return n;
        });

        loader.once('complete', function () {
            collection.forEach(function (col) {
                var key;
                for (key in col.tiles) {
                    var item = col.tiles[key];
                    var path = '/sprites/' + item.image;
                    cache[key] = loader.resources[path].texture;
                }
            });
            callback();
        });

        loader.load();  
    };

    this.prepareLayers = function (layers) {
        layers.forEach(function (layer) {
            if (layer.type == 'tilelayer') {
                self.generateTile(layer);
            } else if(layer.type == 'objectgroup'){
                layer.objects.forEach(function (obj) {
                    if(obj.type == 'spawn'){
                        if(self.spawnPoint == obj.name){
                            var rect = new Rectangle(obj.x, obj.y, obj.width, obj.height);
                            main.player.entity.position.x = rect.centerPoint().x - Config.player.width / 2;
                            main.player.entity.position.y = rect.centerPoint().y - Config.player.height;
                        }
                    } else if(obj.type == 'wall'){
                        Physics.add(new Rectangle(obj.x, obj.y, obj.width, obj.height), true);
                    }
                });
            }
        });
    };

    this.generateTile = function (tiles) {
        var x = 0;
        var y = 0;
        tiles.data.forEach(function (tile) {
            if (tile != 0) {
                world.addTile(tile, cache[tile - 1], {
                    x: x * self.tilewidth,
                    y: y * self.tileheight
                });
            }
            x++;
            if (x == tiles.width) {
                y++;
                x = 0;
            }
        })
    };
};