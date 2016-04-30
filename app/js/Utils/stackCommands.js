var Stack = {
    _spawn: [],
    get spawn(){
        return this._spawn.shift();
    },
    set spawn(value){
        this._spawn.push(value);
    }
};