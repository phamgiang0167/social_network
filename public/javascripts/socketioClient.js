var connected = false

var socket = io('https://socialnetworktdtu.herokuapp.com/')

socket.emit('setup', userLoggedIn)

socket.on('connected', ()=>{
    connected = true
})
socket.on('message recieved', (newMessage)=>{
    messageRecieved(newMessage)
}) 