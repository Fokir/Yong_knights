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
        if(json.properties && json.properties.spawn && !Stack.isSpawn()){
            Stack.spawn = json.properties.spawn;
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
                    var write_key = parseInt(key);
                    write_key  += col.firstgid;
                    var item = col.tiles[key];
                    var path = '/sprites/' + item.image;
                    cache[write_key] = loader.resources[path].texture;
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
                var spawn = Stack.spawn;
                var rectangle;
                layer.objects.forEach(function (obj) {
                    if(obj.type == 'spawn'){
                        var rect = new Rectangle(obj.x, obj.y, obj.width, obj.height);
                        if(spawn == obj.name){
                            main.player.entity.setPosition(rect.centerPoint().x, rect.centerPoint().y);
                        }
                    } else if(obj.type == 'wall'){
                        world.physics.add(null, obj.x, obj.y, obj.width, obj.height, true);
                    } else if(obj.type == 'lvl'){
                        rectangle = world.addTrigger(obj.x, obj.y, obj.width, obj.height);
                        rectangle.trigger = new levelSelect(obj.properties.url, obj.properties.spawn)
                    } else if(obj.type == 'dialog'){
                        rectangle = world.addTrigger(obj.x, obj.y, obj.width, obj.height);
                        rectangle.trigger = new dialogPrepare(obj.properties.name);
                    } else if(obj.type == 'decoration'){
                        var decoration = world.getSprite(cache[obj.gid], obj.x, obj.y - obj.height);
                        decoration.width = obj.width;
                        decoration.height = obj.height;
                        world.addObject(decoration);
                        console.log(obj);
                    }
                });
            }
        });
    };

    this.generateTile = function (tiles) {
        var x = 0;
        var y = 0;
        world.startTileGenerate();
        tiles.data.forEach(function (tile) {
            if (tile != 0) {
                world.addTile(tile, cache[tile], {
                    x: x * self.tilewidth,
                    y: y * self.tileheight
                });
            }
            x++;
            if (x == tiles.width) {
                y++;
                x = 0;
            }
        });
        world.endTileGenerate(tiles.width * self.tilewidth, tiles.height * self.tileheight);
    };
};