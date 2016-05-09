var levelSelect = function (lvl, spawn) {
    this.call = function () {
        if(spawn){
            Stack.spawn = spawn;
        }
        main.world.Loader.load('/maps/' + lvl + '.json');
    };

    this.out = function () {

    }
};

var dialogPrepare = function (name) {
    var dialog = Dialog.get(name);
    this.call = function () {
        dialog.show();
        main.interface.show();
    };

    this.out = function () {
        Dialog.current = null;
        main.interface.hide();
    }
};