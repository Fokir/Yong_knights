var Dialog = {
    _list: {},
    add: function (name, dialog) {
        this._list[name] = dialog;
    },
    get: function (name) {
        return this._list[name];
    },
    current: null,
    init: function (world, draw, main) {
        var self = this;
        var control = Keyboard();

        var container = new PIXI.Container();
        container.renderable = false;
        container.alpha = 0.8;
        draw.addGlobal(container);

        var bg = draw.sprite(PIXI.Texture.fromImage('/sprites/dialog.png'));
        container.addChild(bg);

        var name = new PIXI.Text('',{
            font : '18px Arial',
            fill : 0xffffff,
            align : 'center'
        });
        name.x = 15;
        name.y = 15;
        container.addChild(name);

        var text = new PIXI.Text('',{
            font : '16px Arial',
            fill : 0xffffff,
            align : 'left',
            wordWrap: true,
            wordWrapWidth: 560
        });
        text.x = 15;
        text.y = 45;
        container.addChild(text);

        control.onDown('e', function () {
            center();
            if(self.current == null){
                container.renderable = false;
                DisableControl.remove('w');
                DisableControl.remove('s');
                DisableControl.remove('d');
                DisableControl.remove('a');
            } else{
                DisableControl.add('w');
                DisableControl.add('s');
                DisableControl.add('d');
                DisableControl.add('a');
                container.renderable = true;
                name.text = self.current.name + ': ';
                text.text = self.current.text;
                self.current = self.current.next;
            }
        });

        function center() {
            container.width = bg.width;
            container.height = bg.height;
            container.x = (Draw.width - container.width) / 2;
            container.y = Draw.height - container.height - 25;
        }
    }
};

var _dialog = function (name) {
    this.start = null;
    Dialog.add(name, this);
    this.show = function () {
        Dialog.current = this.start;
    }
};

var Phrase = function (name, text, param) {
    this.next = null;
    this.name = name;
    this.type = param instanceof Array ? 0 : 1;
    if (this.type === 0) {
        this.array = param;
    }
    this.text = text;
};