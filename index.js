/************************************************************

Control SG90 Pan/Tilt from node.js + netduino Plus 

Author : 7M4MON
Date : 2015/06/15
Licence : MIT

************************************************************/

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
    res.sendfile('index.html');
    
});

app.use(express.static(__dirname + '/public'));

http.listen(3000,function(){
    console.log('listen 3000 port');
});


/*
socket client
*/

var net = require('net');

var client = new net.Socket();
client.connect(23, '192.168.40.44', function() {
	console.log('Connected');
});

var rcvHexBuff = "";
var rcvStrBuff = "";

//データが飛んできた場合
client.on('data', function(data) {
	//バッファに足す
	console.log( String(data));
	io.emit('recvmsg', String(data) );
});

io.on('connection',function(socket){
    socket.on('sendmsg',function(msg){
    console.log(msg);
        client.write(msg,function(err,results){
        });
    });
});
 
client.on('close', function() {
	console.log('Connection closed');
});