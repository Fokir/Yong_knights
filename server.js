var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);

app.use(express.static('./dist/'));

http.listen(80, function(){
    console.log('listening on *:80');
});
