$(document).ready(() => {

    $.get(`/api/chats/${chatId}`, (data) => $("#chatName").text(getChatName(data)))

    $.get(`/api/chats/${chatId}/messages`, (data) => {
        var messages = []
        var lastSenderId = ""
        data.forEach((element,index) => {
            var html = createMessageHtml(element, data[index + 1], lastSenderId)
            messages.push(html)
            lastSenderId = element.sender._id
        })
        var messageHtml = messages.join("")
        addMessagesHtmlToPage(messageHtml)
    })
}) 

$("#chatNameButton").click(() => {
    var name = $("#chatNameTextbox").val().trim();
    
    $.ajax({
        url: "/api/chats/" + chatId,
        type: "PUT",
        data: { chatName: name },
        success: (data, status, xhr) => {
            if(xhr.status != 204) {
                alert("could not update");
            }
            else {
                location.reload();
            }
        }
    })
}) 

$('.sendMessageButton').click(()=>{
    messageSubmitted()
})
$('.inputTextbox').keydown((event)=>{
    if(event.which === 13 && !event.shiftkey){
        messageSubmitted()
        return false
    }
})

function addMessagesHtmlToPage(html){
    $('.chatMessages').append(html)

}
function messageSubmitted(){
    var content = $('.inputTextbox').val().trim()
    if(content != ""){
        sendMessage(content)
        $('.inputTextbox').val("")
    }
    
}

function sendMessage(content){
    $.post('/api/messages', {content: content, chatId: chatId}, (data, status, xhr)=>{
        // console.log(xhr)
        if(xhr.status != 201){
            
            alert('Could not send message')
            $('.inputTextbox').val("")
            return
        }
        addChatMessageHtml(data)
    })
}

function addChatMessageHtml(message) {
    if(!message || !message._id) {
        alert("Message is not valid");
        return;
    }

    var messageDiv = createMessageHtml(message, null, "");
    addMessagesHtmlToPage(messageDiv);
    // scrollToBottom(true);
}

function createMessageHtml(message, nextMessage, lastSenderId) {

    var sender = message.sender;
    var senderName = sender.displayName;

    var currentSenderId = sender._id;
    var nextSenderId = nextMessage != null ? nextMessage.sender._id : "";

    var isFirst = lastSenderId != currentSenderId;
    var isLast = nextSenderId != currentSenderId;

    var isMine = message.sender._id == userLoggedIn._id;
    var liClassName = isMine ? "mine" : "theirs";

    var nameElement = "";
    if(isFirst) {
        liClassName += " first";

        if(!isMine) {
            nameElement = `<span class='senderName'>${senderName}</span>`;
        }
    }

    var profileImage = "";
    if(isLast) {
        liClassName += " last";
        profileImage = `<img src='${sender.profilePic}'>`;
    }

    var imageContainer = "";
    if(!isMine) {
        imageContainer = `<div class='imageContainer'>
                                ${profileImage}
                            </div>`;
    }

    return `<li class='message ${liClassName}'>
                ${imageContainer}
                <div class='messageContainer'>
                    ${nameElement}
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}