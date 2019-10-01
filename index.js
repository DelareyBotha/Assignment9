let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let fs = require('fs');

fs.writeFile('messageLog.json',"[]",  (err) => {
    if(err) {throw err;}
    console.log('generating messageLog.json');
});

app.get('/',  (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/messages',  (req,res) => {
    res.sendFile(__dirname + '/messages.html');
});

app.get('/messageLog.json',  (req,res) => {
    res.sendFile(__dirname + '/messageLog.json');
});

io.on('connect', (socket) => {
    console.log('New client');

    socket.on('sent message', (msg) => {

        let object = JSON.parse(msg);
        fs.readFile('messageLog.json', (err, data) => {
            let json = JSON.parse(data);
            json.push(object);
            io.emit('update message',json);
            fs.writeFile("messageLog.json", JSON.stringify(json), (err) => {
                if(err) {throw err;}
                console.log('File updated');
            });
        });
    });

    socket.on('disconnect', () => {
        console.log('client left');
    });
});

http.listen(3000, () => {
    console.log('listening on port *:3000');
});