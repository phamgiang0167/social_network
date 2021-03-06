$(document).ready(() => {
    $.get("/api/chats", (data, status, xhr) => {
        if(xhr.status == 400) {
            alert("Could not get chat list.");
        }
        else {
            outputChatList(data, $(".resultsContainer"));
        }
    })
})

function outputChatList(chatList, container) {
    chatList.forEach(chat => {
        var html = createChatHtml(chat);
        container.append(html);
    })

    if(chatList.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>");
    }
}

function createChatHtml(chatData){
    console.log(chatData)
    var chatName = getChatName(chatData)
    var image =getChatImageElements(chatData)
    var lastestMessage = getLastestMessage(chatData.lastestMessage)
    return `<a href="/messenger/${chatData._id}" class="resultListItem">
                ${image}    
                <div class="resultsDetailsContainer ellipsis">
                    <span class="heading ellipsis">${chatName}</span>
                    <span class="subText ellipsis">${lastestMessage}</span>
                    
                </div>
            </a>
    `
}

function getLastestMessage(lastestMessage){
    if(lastestMessage != null){
        var sender = lastestMessage.sender
        return ` ${lastestMessage.content}`
    }
    return "New chat"
}

function getChatImageElements(chatData){
    var otherChatUsers = getOtherChatUsers(chatData.users)
    var groupChatClass = ""
    var chatImage = getUserChatImageElement(otherChatUsers[0])
    if(otherChatUsers.length > 1){
        groupChatClass = "groupChatImage"
        chatImage += getUserChatImageElement(otherChatUsers[1])
    }
    return `<div class="resultsImageContainer ${groupChatClass}">${chatImage}</div>`
}

function getUserChatImageElement(user){
    if(!user || !user.profilePic){
        return alert("user passed")
    }
    return `<img src="${user.profilePic}">`
}