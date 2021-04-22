var connected = false

var socket = io('https://localhost:3000')

socket.emit('setup', userLoggedIn)

socket.on('connected', ()=>{
    connected = true
})
socket.on('message recieved', (newMessage)=>{
    messageRecieved(newMessage)
}) 