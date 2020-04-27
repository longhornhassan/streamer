var getUserMedia = require('getusermedia')

var happens = (data) => {
  console.log(data);
}

const rt = "https://streamservice.herokuapp.com/" 
getUserMedia({ video: true, audio: true }, function (err, stream) {
  if (err) return console.error(err)

  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init', //true of not, first peer (address)
    trickle: false,
    stream: stream,
    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
  })

  var num = 0; 
  //data is what our peer is capable of
  peer.on('signal', function (data) {
    var xhr = new XMLHttpRequest();
    //document.getElementById('yourId').value = JSON.stringify(data)
    var origin = rt+"/updateB"; 
    if(location.hash === '#init'){
      origin = rt+"/updateA";
    }

    xhr.open("POST", origin, true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/json");
    var myObj = {data: "John", age: 31, city: "New York"};
    xhr.send(JSON.stringify({data: data}));
    console.log("Updated A");
  })

  var number = 1; 
  var makeConnection = setInterval(() => {
      var origin = rt+"/hostA"; 
      if(location.hash === '#init'){
        origin = rt+"/hostB";
      }
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState == XMLHttpRequest.DONE) {
              console.log(xhr.responseText);
              if(JSON.parse(xhr.responseText).length != 0){
                peer.signal(JSON.parse(xhr.responseText));


                //reset server vars
                var xhr2 = new XMLHttpRequest();
                //document.getElementById('yourId').value = JSON.stringify(data)
                var origin2 = rt+"/resetA"; 
                if(location.hash === '#init'){
                  origin2 = rt+"/resetB";
                }
                xhr2.open('GET', origin2, true);


                clearInterval(makeConnection);
              } else {
                var temp = document.createElement('P'); 
                document.body.appendChild(temp)
                temp.innerText = number + "/3 confirmations made!"
                number++; 
                console.log("waiting");
              }
          }
      }
      xhr.open('GET', origin, true);
      xhr.send(null);
    }, 20000);
 

  // document.getElementById('connect').addEventListener('click', function () {
  //   var otherId = JSON.parse(document.getElementById('otherId').value)
  //   //lets peer let them know of eachother
  //   peer.signal(otherId)// let the other peer know, but you in turn gen your own id
  // })

  // document.getElementById('send').addEventListener('click', function () {
  //   var yourMessage = document.getElementById('yourMessage').value
  //   peer.send(yourMessage)
  // })

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
