

var connected = false

var socket = io('http://localhost:3000')

socket.emit('setup', userLoggedIn)

socket.on('connected', ()=>{
    connected = true
})
socket.on('message recieved', (newMessage)=>{
    messageRecieved(newMessage)
}) 

socket.on('notification recevied', (newNotification) =>{
    console.log('new')
})

function emitNotification(noti){
    socket.emit('notification recevied',noti)
}

socket.on('new noti', noti =>{
    onNotification(noti)
})

