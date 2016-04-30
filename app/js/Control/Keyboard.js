var Keyboard = function (disable) {
    if (!(this instanceof Keyboard)) return new Keyboard();
    var listener = new window.keypress.Listener();
    this.keys = {};
    var self = this;
    var keys = ['w', 'a', 's', 'd', 'space', 'u', 'i', 'o', 'shift', 'ctrl'];
    if (!disable) {
        keys.forEach(function (key) {
            self.keys[key] = false;
            listener.register_combo({
                keys: key,
                on_keydown: function (e) {
                    e.preventDefault();
                    self.keys[key] = true;
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
    }
};