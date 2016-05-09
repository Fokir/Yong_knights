var Performance = function () {
    var time = 0;
    this.start = function () {
        time = performance.now();
    };
    this.end = function () {
        console.info(performance.now() - time);
    };
};