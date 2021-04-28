$(document).ready(()=>{
    var page = 0
    $.get('/api/post', results=>{

        // renderPosts(results.slice(page,3), $('.postsContainer'))
        // page += 3
        // $(window).scroll(()=>{
        //     if($(window).scrollTop() + $(window).height() + 1 >= $(document).height()) {
        //         renderPosts(results.slice(page,3), $('.postsContainer'))
        //         page += 3
        //     }
        // })
        renderPosts(results, $('.postsContainer'))
    })
    $.get('/api/users/office', results =>{
        
        var listFaculty = document.getElementsByClassName('listFaculty')
        results.forEach(e =>{
            $(listFaculty).append(`
            <div class='list-group-item'>
                <a class="item-office" data-id="${e._id}" data-page="1">${e.displayName}</a>
            </div>`)
        })
    })
    
})
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now"
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}
function renderPosts(results, conatiner){

    if(!Array.isArray(results)){
        results = [results]
    }
    results.forEach(element => {
        var html = createPostHtml(element)
        conatiner.append(html)

    });
    if(results == 0){
        conatiner.append("<div class='noResult' style='text-align:center'><div style='display: inline-block'><img src='/images/empty-page.jpg'></div></div>")
    }
}

//function render a post
function createPostHtml(postData){
    if($('.noResult')){
        $('.noResult').remove()
    }
    
    var postedBy = postData.postedBy
    // console.log(postedBy)
    // console.log(userLoggedIn)
    var displayName = postData.postedBy._id == userLoggedIn._id ?  "You": postData.postedBy.displayName
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt))
    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? 'active' : ''
    var myOwnPost = postData.postedBy._id == userLoggedIn._id ?  "block":"none"
    var comments = postData.comments
    var isImageExist = postData.image ? "block":"none"
    var content = postData.content
    var codeYoutube = ['none', '']
    if(postData.content.search('https://www.youtube.com/') != (-1)){
        codeYoutube[0] = 'block'
        codeYoutube[1] = postData.content.split("https://www.youtube.com/watch?v=")[1].split(' ')[0]
        content = content.replace('https://www.youtube.com/watch?v=' + codeYoutube[1],'')
    }
    
    var html =  `<div class='post' data-id='${postData._id}' id="${postData._id}">
                    <div class='mainContentContainer'>
                        
                        <div class='postContainer'>
                            
                            <div class='header'>
                                <div class='userImageContainer'> 
                                    <img src='${postedBy.profilePic}'>
                                </div>
                                <div class="nameUserContainer">
                                    <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                                    <div class='date'>${timestamp}</div>
                                </div>
                                
                            </div>
                            <div class='postBody'>
                                <div class="content">${content}</div>
                                <div class="picturePostContainer" style="display: ${isImageExist}">
                                    <div class="picturePost" style="background-image: url(${postData.image})"></div>
                                </div>
                                <div class="videoPostContainer" style="display: ${codeYoutube[0]}">
                                   ${addVideoHtml(codeYoutube[1])}
                                </div>
                            </div>
                            <div class='postFooter'>
                                <div class="reactContainer">
                                    <div class='postButtonContainer like' >
                                        <button class='likeButton ${likeButtonActiveClass}' >
                                            <i class='far fa-heart'></i>
                                            <span>${postData.likes.length || ''}</span>
                                        </button>
                                    </div>
                                    <div class='postButtonContainer'>
                                        <button class='commentButton' data-toggle="modal" data-target="#commentModal">
                                            <i class='far fa-comment'></i>
                                            <span id="countComment${postData._id}">${comments.length || ''}</span>
                                        </button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="actionPostContainer " style = "display: ${myOwnPost}">
                            <div class="dropdown">
                                <button type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    ...
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    <button class="dropdown-item deletePost" type="button">Delete</button>
                                    <button class="dropdown-item editPost" type="button" data-toggle="modal" data-id=${postData._id} data-target="#editPostContentModal">Edit</button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div><hr></div>
                    <div class='showCommentContainer'>
                        <button class="showCommentButton" id="showCommentButton${postData._id}"style="display: none">
                            <p>Show all comments</p>
                        </button>
                        <button class="hiddenCommentButton" id="hiddenCommentButton${postData._id}">
                            <p>Hidden all comments</p>
                        </button>
                        <div class="allCommentsContainer" id='allComment${postData._id}'>
                `
                //Comment list
                comments.reverse().forEach(element =>{
                    // console.log(userLoggedIn._id + "/" + element.commentedBy._id)
                    // console.log(element)
                    // console.log(element)
                    var commentedBy =  element.commentedBy._id == userLoggedIn._id ?  'You':(element.commentedBy.displayName)
                    var myOwnComment = element.commentedBy._id == userLoggedIn._id ? 'block' : 'none'
                    html = html + `
                        <div class="mainCommentContainer" data-id="${element._id}" id="comment${element._id}">
                            <div class='userImageContainer'> 
                                <img src='${element.commentedBy.profilePic}'>
                            </div>
                            <div class='commentContainer'>
                                <div class='commentHeader'>
                                    <a href='/profile/${element.commentedBy._id}' class='displayName'>${commentedBy}</a>
                                    <span class='date'>${timeDifference(new Date(), new Date(element.createdAt))}</span>
                                </div>
                                <div class='commentBody' >
                                    <span id='commentContent${element._id}'>${element.content}</span>
                                </div>
                            </div> 
                            <div class="actionCommentContainer " style = "display: ${myOwnComment}">
                                <div class="dropdown">
                                    <button type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        ...
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                        <button class="dropdown-item deleteComment" data-id=${element._id} type="button">Delete</button>
                                        <button class="dropdown-item editComment" data-id=${element._id} type="button">Edit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `})
                    html = html + `</div></div>`
    return html
}

var pagination = 1
$(document).on('click', '.item-office, .page-link', e =>{
    var button = e.target
    var data_id = $(button).data('id')
    pagination = $(button).data('page')

    $.ajax({
        url: '/api/notification/office/'+ data_id + "/" + `${pagination}`,
        type: "GET",
        success: (data)=>{
            console.log(data)
            if($(button).attr('class') == "item-office"){
                 swal("Success", "Selected");
            }
           
            $('.listNotification').html('')
            $('.pagination').html('')
            data.listNoti.forEach(e=>{
                // render list notification
                $('.listNotification').append(`
                    <div class='list-group'>
                        <div class='list-group-item'>
                            <div class='category'><i>[${e.category}]</i></div>
                            <div class='title'><a href="/notification/${e._id}" target="_blank">${e.title}</a></div>
                            <div class='owner'><small>- posted by ${e.postedBy.displayName}</small></div>
                        </div>
                    </div>
                `)
            })
            fpagination(data, data_id)
            
            
        }
    })
})
function fpagination(data, data_id){
    console.log(data)
    console.log(data_id)
    if(data.pages > 0){
        if(data.currentPage == 1){
            $('.pagination').append(`
                <li class="page-item disabled">
                    <a class="page-link" data-id=${data_id} data-page="1">First</a>
                </li>
            `)
        }else{
            $('.pagination').append(`
                <li class="page-item">
                    <a class="page-link" data-id=${data_id} data-page="1">First</a>
                </li>
            `)
        }
        var i = (Number(data.currentPage) > 3 ? Number(data.currentPage) - 2 : 1)
        if(i !== 1){
            $('.pagination').append(`
                <li class="page-item disabled">
                    <a class="page-link" data-id=${data_id} >...</a>
                </li>
            `)
        }
        for(; i <= (Number(data.currentPage) + 2) && i <= data.pages; i++){
            if(i == data.currentPage){
                $('.pagination').append(`
                    <li class="page-item active">
                        <a class="page-link" data-id=${data_id} data-page=${i}>${i}</a>
                    </li>
                `)
            }else{
                $('.pagination').append(`
                    <li class="page-item">
                        <a class="page-link" data-id=${data_id} data-page=${i}>${i}</a>
                    </li>
                `)
            }
            if (i == Number(data.currentPage) + 2 && i < data.pages){
                $('.pagination').append(`
                    <li class="page-item disabled">
                        <a class="page-link" data-id=${data_id} data-page=${i}>...</a>
                    </li>
                `)
            }
        }
        if(data.currentPage == data.pages){
            $('.pagination').append(`
                <li class="page-item disabled">
                    <a class="page-link" data-id=${data_id} data-page=${data.pages}>Last</a>
                </li>
            `)
        }else{
            $('.pagination').append(`
                <li class="page-item">
                    <a class="page-link" data-id=${data_id} data-page=${data.pages}>Last</a>
                </li>
            `)
        }
    }
}

function getChatName(chatData){
    var chatName = chatData.chatName
    if(!chatName){
        var ortherChatUsers = getOtherChatUsers(chatData.users)
        var namesArray = ortherChatUsers.map(user => user.displayName)
        chatName = namesArray.join(", ")    
    }

    return chatName
}

function getOtherChatUsers(users){
    if(users.length == 1){
        return users
    }
    return users.filter((user)=>{
        return user._id != userLoggedIn._id
    })
}

function messageRecieved(newMessage){
    if($('.chatContainer').length == 0){

    }else{
        addChatMessageHtml(newMessage)
    }
}

function addVideoHtml(codeYoutube){
    return `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${codeYoutube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ></iframe>`
}


