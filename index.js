let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let fs = require('fs');

fs.writeFile('messageLog.txt', 'Messages:', (err) => {
    if(err) {throw err;}
    console.log('File created');
});

app.get('/',  (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('connection detected');
    io.on('sent message', (msg) => {
        console.log('inside sent message event');
        let object = JSON.parse(msg);
        fs.appendFile('messageLog.txt', 'Name: ' + object.name + ', Message: ' + object.msg, 'utf-8', (err) => {
            if (err) {throw err;}
            console.log('Message Appended successfully');
        });
        console.log('Message : ' + msg);
    });
    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on port *:3000');
});