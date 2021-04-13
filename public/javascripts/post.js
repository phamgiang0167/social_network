

//get Post Id
function getPostID(element){
    var isRoot = element.hasClass('post')
    var rootElement = isRoot == true ? element : element.closest('.post')
    var postID = rootElement.data().id
    if(postID === undefined) return alert('post id undefied')
    return postID
}

/**create post*/
//check content exist
$('#postTextArea').keyup((event)=>{
    var textbox = $(event.target)
    
    var value = textbox.val().trim()
    var submitButton =  $('#submitPostButton')
    if(submitButton.length == 0){
        alert('no submit ')
    }
    if(value ==""){
        submitButton.prop('disabled', true)
        return
    }
    if(value.search('https://www.youtube.com/') != (-1)){
        $('#postPhoto').attr('disabled', 'true')
    }else{
        $('#postPhoto').removeAttr("disabled")
    }
    submitButton.prop('disabled', false)
})
$('#commentTextArea').keyup((event)=>{
    var textbox = $(event.target)
    
    var value = textbox.val().trim()
    var submitButton =  $('#submitCommentButton')
    if(submitButton.length == 0){
        alert('no submit ')
    }
    if(value ==""){
        submitButton.prop('disabled', true)
        return
    }
    submitButton.prop('disabled', false)
})

//upload photo
var cropper
$('#postPhoto').change(function(){
    if(this.files && this.files[0]){
        var reader = new FileReader()
        reader.onload = (e)=>{
            var image = document.getElementById('imagePreview')
            image.src = e.target.result
            $('.imagePreviewContainer').attr('style', 'display:inline-block')
            $('#imagePreview').attr('src', e.target.result)
            if(cropper !== undefined){
                cropper.destroy()
            }

            cropper = new Cropper(image, {
                aspectRatio: 1/1,
                background: false
            })
        }
        reader.readAsDataURL(this.files[0])
    }
})

//submit post
$('#submitPostButton').click(()=>{
    var button = $(event.target)
    var textbox =$("#postTextArea")
    var data = {
        content: textbox.val()
    }
    if(cropper == undefined){
        $.post('/api/post', data, (postData, status, xhr)=>{
            $('#contentPostModal').modal('hide')
            swal("Profile image changed successfully")
            var html = createPostHtml(postData)
            $('.postsContainer').prepend(html)
            textbox.val('')
            button.prop('disabled', true)
        })
    }else{
        $.post('/api/post', data, (postData, status, xhr)=>{
            var canvas = cropper.getCroppedCanvas()
            canvas.toBlob((blob)=>{
                var formData = new FormData()
                formData.append('cropped', blob)
                $.ajax({
                    url: "/api/post/uploads/" + postData._id,
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: (updated)=>{
                        $('#contentPostModal').modal('hide')
                        swal("Profile image changed successfully")
                        var html = createPostHtml(updated)
                        $('.postsContainer').prepend(html)
                        textbox.val('')
                        button.prop('disabled', true)
                    }
                })
            })
        })
    }
})

//like handler
$(document).on('click', '.likeButton', ()=>{
    var button = $(event.target)
    var postId = getPostID(button)
    if(postId === undefined){
        return
    }

    $.ajax({
        url: `/api/post/like/${postId}`,
        type: 'PUT',
        success: (postData)=>{
            button.find('span').text(postData.likes.length || '')
            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass('active')
            }else{
                button.removeClass('active')
            }
                
        }
        
    })
})

//add id for comment modal
$("#commentModal").on("show.bs.modal", (event) => {
    var button = $(event.relatedTarget);
    var postId = getPostID(button);
    $("#submitCommentButton").data("id", postId);
    
})

//submit a commnet
$('#submitCommentButton').click((event)=>{
    var button = $(event.target)
    var textbox =$("#commentTextArea");
    var postId = button.data().id
    var data = {
        postId: postId,
        content: textbox.val()
    }
    
    $.ajax({
        url: `/api/post/comment`,
        type: 'POST',
        data: data,
        success: (commentData) =>{
            $.ajax({
                url: `/api/post/${data.postId}/comment/${commentData._id}`,
                type: 'PUT',
                success: ()=>{
                    $('#commentTextArea').val('')
                    $('#commentModal').modal('hide')
                }
            })
            $.ajax({
                url: `/api/post/${data.postId}/comment`,
                type: 'GET',
                success: (comments)=>{
                    var idAllComment = 'allComment' + comments[0].onPost
                    var html = document.getElementById(idAllComment)
                    html.innerHTML = ''
                    var child = ''
                    comments.reverse().forEach(element =>{
                        var displayName =  element.commentedBy._id == userLoggedIn._id ?  'You':(element.commentedBy.displayName)
                        var myOwnComment =  element.commentedBy._id == userLoggedIn._id ?  "block": "none"
                        child = child + `
                            <div class="mainCommentContainer" data-id="${element._id}" id="comment${element._id}">
                                <div class='userImageContainer'> 
                                    <img src='${element.commentedBy.profilePic}'>
                                </div>
                                <div class='commentContainer'>
                                    <div class='commentHeader'>
                                        <a href='/profile/${element.commentedBy._id}' class='displayName'>${displayName}</a>
                                        <span class='date'>${timeDifference(new Date(), new Date(element.createdAt))}</span>
                                    </div>
                                    <div class='commentBody' >
                                        <span id='commentContent${element._id}'>${element.content}</span>
                                    </div>
                                </div>
                                <div class="actionCommentContainer" style="display:${myOwnComment}">
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
                    html.insertAdjacentHTML('afterbegin',child)
                    updateCountComment = document.getElementById(`countComment${comments[0].onPost}`).innerHTML = comments.length
                }
            })
        }
    })
})

$(document).on('click', '.hiddenCommentButton', ()=>{
    var button = $(event.target)
    var postId = getPostID(button)
    document.getElementById(`allComment${postId}`).style.display = 'none'
    document.getElementById(`showCommentButton${postId}`).style.display = 'block'
    document.getElementById(`hiddenCommentButton${postId}`).style.display = 'none'
})

$(document).on('click', '.showCommentButton', ()=>{
    var button = $(event.target)
    var postId = getPostID(button)
    document.getElementById(`allComment${postId}`).style.display = 'block'
    document.getElementById(`showCommentButton${postId}`).style.display = 'none'
    document.getElementById(`hiddenCommentButton${postId}`).style.display = 'block'
})

$(document).on('click', '.deletePost', (event)=>{
    swal({
        title: "Are you sure?",
        text: "All data about this post will be lost",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    .then((willDelete) => {
        if (willDelete) {
            var button = $(event.target)
            var postId = getPostID(button)
            $.ajax({
                url: "/api/post/" + postId,
                type: "DELETE",
                success: ()=>{
                    $(`#${postId}`).remove()
                    $.ajax({
                        url: "/api/post/" + postId + "/comment/",
                        type: "DELETE",
                        success: ()=>{
                            
                        }
                    })
                }
            }),
            swal("Poof! Successfully deleted the post!", {
            icon: "success",
        });
        } else {
          swal("The post has not been deleted yet!");
        }
    });
})


$(document).on('click', '.deleteComment', (event)=>{
    swal({
        title: "Are you sure?",
        text: "All data about this post will be lost",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    .then((willDelete) => {
        if (willDelete) {
            var button = $(event.target)
            var commentId = button.data().id
            var postId = getPostID(button)
            var countComment = document.getElementById(`countComment${postId }`)
            countComment.innerHTML = countComment.innerHTML - 1
            $.ajax({
                url: "/api/comment/" + commentId,
                type: "DELETE",
                success: ()=>{
                    $(`#comment${commentId}`).remove()
                    
                }
            })
            swal("Poof! Successfully deleted the post!", {
                icon: "success",
            });
        } else {
            swal("The post has not been deleted yet!",{
                icon: 'error'
            });
        }
    });
})

$(document).on('click', '.editComment', (event)=>{
    swal("If you want to edit this comment, please :", {
        content: "input",
        buttons: true,
        dangerMode: true,
    })
    .then((value) => {
        if(value){
            var button = $(event.target)
            var commentId = button.data().id
            $.ajax({
                url: "/api/comment/" + commentId + "/" + value,
                type: "PUT",
                success: ()=>{
                    var comment = $(`#comment${commentId}`).find(`#commentContent${commentId}`)
                    comment.html(value)
                }
            })
            swal('Edit this commet successful',{
                icon: 'success'
            })
        }else{
            swal('You have canceled or did not enter anything',{
                icon: 'error'
            })
        }
    });
})

$('#contentPostModal').on('hide.bs.modal', e =>{
    $('#postPhoto').val(null)
    $('#postPhoto').prop("disabled", false)
    $('.imagePreviewContainer').css('display', 'none')
    $('#postTextArea').val(null)
})

