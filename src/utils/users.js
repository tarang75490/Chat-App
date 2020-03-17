const users = []

const addUser = ({id,username,room}) =>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()


    //validate the data
    if (!(username && room))
    {
        return {
            error:"Username and room is required"
        }
    }

    // check for existing User
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate username 
    if(existingUser) {
        return {
            error : "username is in use !!!"
        }
    }

    //Store the user 
    const user = {id,username,room}
    users.push(user)

    return {user}


}

const removeUser = (id) =>{
    const index = users.find((user)=>{
        return user.id = id
    })
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

// addUser({
//     id:22,
//     username:'Tarang       ',
//     room:"212"
// })
// addUser({
//     id:23,
//     username:'mike       ',
//     room:"212"
// })
// addUser({
//     id:21,
//     username:'mike 222      ',
//     room:"2122  "
// })

const getuser = (id) =>{
    const user  = users.find((user) => {
        return user.id === id
    })

    return user
}

const getUserInRoom = (room) =>{
    const filtereduser = users.filter((user) => user.room === room)
    return filtereduser
}


// console.log(users)
// console.log(getuser(215))
// console.log(getUserInRoom('2124'))



module.exports = {
    addUser,
    removeUser,
    getuser,
    getUserInRoom
}