var Physics = {
    _objects: [],
    debugContainer: new PIXI.Graphics(),
    _debug: false,
    _world: null,
    debug: function (b) {
        this._debug = b;
        if (!b) {
            this.debugContainer.clear();
        }
    },
    loop: function () {
        var self = this;
        self._objects.forEach(function (_item) {
            self._objects.forEach(function (_i) {
                if (_item.__hash__ != _i.__hash__) {
                    if (_item.getActualRectangle().isCollision(_i.getActualRectangle()) && !_item.__static__) {
                        var item = _item.getActualRectangle();
                        var i = _i.getActualRectangle();

                        if (item.y + item.h > i.y) {
                            _item.cancelY();
                        }
                        if (item.x < i.x + i.w) {
                            _item.cancelX();
                        }
                        if (item.y < i.y + i.h) {
                            _item.cancelY();
                        }
                        if (item.x + item.w > i.x) {
                            _item.cancelX();
                        }
                    }
                }
            });
            _item.loop();
        });

        if (self._debug) {
            self.debugContainer.clear();
            this.debugContainer.beginFill(0xC92121);
            this.debugContainer.alpha = 0.4;
            self._objects.forEach(function (item) {
                item = item.getActualRectangle();
                self.debugContainer.drawRect(item.x, item.y, item.w, item.h);
            });
        }
    },
    add: function (rec, _static) {
        rec.__hash__ = Math.random();
        rec.__static__ = _static;
        this._objects.push(rec);
    },

    addRectangle: function (x, y, w, h, _static) {
        this.add(new Rectangle(x, y, w, h), _static);
    },

    clear: function () {
        var save = [];
        this._objects.forEach(function (item) {
            if (item.__permanent__) {
                save.push(item);
            }
        });
        this._objects = save;
    },

    init: function (draw) {
        draw.add(this.debugContainer);
        var gravity = new b2Vec2(0, 9.8);
        this._world = new b2World(gravity, true);
    },

    step: function (dt) {
        this.dtRemaining += dt;
        while (this.dtRemaining > this.stepAmount) {
            this.dtRemaining -= this.stepAmount;
            this.world.Step(this.stepAmount,
                8, // velocity iterations
                3); // position iterations
        }
        if (this.debugDraw) {
            this.world.DrawDebugData();
        }
    }
};