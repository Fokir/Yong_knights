var Physics = {
    _objects: [],
    debugContainer: new PIXI.Graphics(),
    _debug: false,
    debug: function (b) {
        this._debug = b;
        if (!b) {
            this.debugContainer.clear();
        }
    },
    loop: function () {
        var self = this;
        self._objects.forEach(function (item) {
            self._objects.forEach(function (i) {
                if (item.__hash__ != i.__hash__) {
                    if (item.getActualRectangle().isCollision(i.getActualRectangle()) && !item.__static__) {
                        var _item = item.getActualRectangle();
                        var _i = i.getActualRectangle();
                        if (_item.y + _item.h > _i.y) {
                            item.cancelY();
                        }
                        if (_item.x < _i.x + _i.w) {
                            item.cancelX();
                        }
                        if (_item.y < _i.y + _i.h) {
                            item.cancelY();
                        }
                        if(_item.x + _item.w > _i.x){
                            item.cancelX();
                        }
                    }
                }
            });
            item.loop();
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
        this.debugContainer.beginFill(0xC92121);
        this.debugContainer.alpha = 0.4;
    }
};