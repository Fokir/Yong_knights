var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);

app.use(express.static('./app/'));

http.listen(80, function(){
    console.log('listening on *:80');
});
