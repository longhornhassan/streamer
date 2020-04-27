//npm packages
const express = require('express'); 
const app = express();
const path = require('path'); 
const server = require('http').Server(app); 
const io = require('socket.io')(server); 
const morgan = require('morgan'); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
var cors = require('cors')
app.use(cors())
app.use(morgan('tiny'));


var hostA = ""; 
var hostB = "";

//setting up port
//3000 for now, supposed to be 8080
var port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log("Server is up"); 
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html')); 
}); 


app.get('/#init', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html')); 
});

app.post('/updateAll', (req,res) => {
    //console.log("HERE");
    console.log(req.body.data);
    io.emit("url", req.body.data); 
    return res.status(200); 
});

app.post('/updateA', (req, res) => {
    hostA = req.body.data; 
    return res.status(200);
}); 

app.post('/updateB', (req, res) => {
    hostB = req.body.data; 
    return res.status(200);
}); 

app.get('/hostA', (req, res) => {
    ret = '';
    if(hostA !== ""){
        ret = hostA; 
        hostA = "";
    }
    return res.status(200).send(JSON.stringify(ret)); 
}); 

app.get('/hostB', (req, res) => {
    ret = '';
    if(hostB !== ""){
        ret = hostB; 
        hostB = "";
    }
    return res.status(200).send(JSON.stringify(ret));
}); 

app.get('/resetA', (req, res) => {
    hostA = "";
    return res.status(200).send(JSON.stringify(hostB));
}); 

app.get('/resetB', (req, res) => {
    hostB = "";
    return res.status(200).send(JSON.stringify(hostB));
});



