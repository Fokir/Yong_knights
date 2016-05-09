var Keyboard = function (disable) {
    if (!(this instanceof Keyboard)) return new Keyboard();
    var listener = new window.keypress.Listener();
    this.keys = {};
    this.events = {};
    var self = this;
    var keys = ['w', 'a', 's', 'd', 'space', 'u', 'i', 'o', 'shift', 'ctrl', 'e'];
    if (!disable) {
        keys.forEach(function (key) {
            self.keys[key] = false;
            listener.register_combo({
                keys: key,
                on_keydown: function (e) {
                    e.preventDefault();
                    if(!DisableControl.is(key)){
                        self.keys[key] = true;
                        if(self.events[key]){
                            self.events[key].forEach(function (callback) {
                                callback();
                            });
                        }
                    }
                },
                on_keyup: function (e) {
                    self.keys[key] = false;
                },
                prevent_repeat: true
            });
        });
    }

    this.is = function (key) {
        return !!this.keys[key];
    };

    this.onDown = function (key, callback) {
        if(!this.events[key]){
            this.events[key] = [];
        }
        this.events[key].push(callback);
    };
};

var DisableControl = {
    list: {},
    add: function (key) {
        this.list[key] = true;
    },
    remove: function (key) {
        this.list[key] = false;
    },
    is: function (key) {
        return !!this.list[key];
    }
};