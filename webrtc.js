var getUserMedia = require('getusermedia')



getUserMedia({ video: true, audio: false }, function (err, stream) {
  if (err) return console.error(err)

  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init', //true of not, first peer (address)
    trickle: false,
    stream: stream
  })

  var num = 0; 
  //data is what our peer is capable of
  peer.on('signal', function (data) {
    var xhr = new XMLHttpRequest();
    document.getElementById('yourId').value = JSON.stringify(data)

    xhr.open("POST", 'https://streamservice.herokuapp.com/updateAll', true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    var myObj = {data: "John", age: 31, city: "New York"};
    xhr.send(JSON.stringify({data: data}));
  })

  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    //lets peer let them know of eachother
    peer.signal(otherId)// let the other peer know, but you in turn gen your own id
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  //when you get data from the peer
  peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('stream', function (stream) {
    var video = document.createElement('video')
    document.body.appendChild(video)
    video.srcObject = stream;
    video.play()
  })
})
