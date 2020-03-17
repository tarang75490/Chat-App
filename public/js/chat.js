const socket = io()   
// socket.on('Countupdated',(count)=>{
//     console.log('Count Has Been Updated',count)

// })
// $(document).ready(function(){
    
//     $('#increased').click(()=>{
//         socket.emit('increment')
//     })
// })

// document.querySelector('#increased').addEventListener('click',()=>{

//     console.log('clicked')
//     socket.emit('increment')
// })
//Elements
const $messageForm = document.querySelector('#form1')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormButtonLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = $('#message-template').html()
const locationTemplate = $('#location-template').html()
const sidebarTemplate = $('#sidebar-template').html()

//Options
const {username ,room } = Qs.parse(location.search,{ ignoreQueryPrefix : true} )

const autoscroll = () => {
    // New Message Element
    const $newMessage = $messages.lastElementChild


    //Height of the new message element
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight  + newMessageMargin  // to get the how tall the element is
    
    //Visible Height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled??
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('message',(message)=>{
    console.log(message) 
    
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationTemplate,{
        username:url.username,
        url:url.text,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
  const html = Mustache.render(sidebarTemplate,{
      room,
      users
  })
  document.querySelector('#sidebar').innerHTML = html
})


$(document).ready(function(){  
    $('#form1').submit((e)=>{
        e.preventDefault();
        // disable
        $messageFormButton.setAttribute('disabled','disabled')

        message = e.target.elements.message.value
        socket.emit('sendMessage',message,(error) => {
            //enable
            $messageFormButton.removeAttribute('disabled')
            $messageFormInput.focus()



            $('#form1')[0].reset()
            if(error){
                return console.log(error)
            }


            console.log('Message has been delivered')
        })

    })
    $('#send-location').click(()=>{

        $messageFormButtonLocation.setAttribute('disabled','true')
        if(!navigator.geolocation){
            return alert('Geolocation is not supported by your Browser')
        }

        navigator.geolocation.getCurrentPosition((position)=>{
            
            coords= {longitude:position.coords.longitude,
                latitude:position.coords.latitude}
                socket.emit('sendLocation',coords,(remessage)=>{
                    $messageFormButtonLocation.removeAttribute('disabled')
                    console.log(remessage)
                })
        })
    })
})



socket.emit('join',{ username, room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }

})