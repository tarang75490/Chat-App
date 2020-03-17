const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const  generateMessage = require('./utils/messages.js')
const { addUser,removeUser,getuser,getUserInRoom} = require('./utils/users.js')





const app = express()
const server = http.createServer(app)
const io = socketio(server)




const port = process.env.PORT || 3000
const publicstaticpath = path.join(__dirname,'../public')

app.use(express.static(publicstaticpath))

// let count = 0

// server (emit) -> client (receive)   -- countupdated -->acknowledgement  -->server
// clent (emit)  -> server (receive)   -- increment  ----> acknowledgement   ---> client



io.on('connection',(socket)=>{                   //if more than one client then this will run to render request  each time for all the client
    console.log('New WebSocket Connected')
    
    // socket.emit('Countupdated',count)
    // socket.on('increment',()=>{
    //     count++
    //     // socket.emit('Countupdated',count)
    //     io.emit('Countupdated',count)
    // })
    socket.on('join',({username,room},callback) =>{
        const {error,user} =  addUser({id:socket.id,username,room})
        
        if (error) {
            return   callback(error)
        }


        socket.join(user.room) 
        console.log(getUserInRoom(user.room))
        socket.emit('message',generateMessage("Admin",'Welcome!!!!!'))
        socket.broadcast.to(user.room).emit('message',generateMessage("Admin",`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage',(message1,callback)=>{
        const user = getuser(socket.id)

        var filter = new Filter();
            if (filter.isProfane(message1)){
                return callback('Profanity is not allowed')
            }

        io.to(user.room).emit('message',generateMessage(user.username,message1))
        callback()

    })
    socket.on('sendLocation',(message,callback)=>{
        const user =  getuser(socket.id)


        message = `https://www.google.com/maps?q=${message.latitude},${message.longitude}`
        io.to(user.room).emit('locationMessage',generateMessage(user.username,message))
        callback('Location Shared')
    })

    
    
    
    
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        
        if(user){
            io.to(user.room).emit('message',generateMessage("Admin",`${user.username} Has Left !!!!!`))  
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserInRoom(user.room)
            })          
        }

    })




})




server.listen(port,()=>{
    console.log('Listening to Port '+port)
})