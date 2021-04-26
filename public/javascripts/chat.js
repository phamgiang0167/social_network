var selectedUsers = []
var timer


$("#userSearchTextbox").keydown((event) => {
    clearTimeout(timer);
    var textbox = $(event.target);
    var value = textbox.val();
    if (value == "" && (event.which == 8 || event.keyCode == 8)) {
        // remove user from selection
        selectedUsers.pop();
        updateSelectedUsersHtml();
        $(".resultsContainer").html("");

        if(selectedUsers.length == 0) {
            $("#createChatButton").prop("disabled", true);
        }

        return;
    }
    timer = setTimeout(() => {
        value = textbox.val().trim();

        if(value == "") {
            $(".resultsContainer").html("");
        }
        else {
            $.get("/api/users", { keyword: value }, (results) => {
                
                $('.resultsContainer').html('')
                var index = 0
                results.forEach(element => {
                    // console.log(element)
                    for(var i = 0; i < selectedUsers.length; i++){
                        if(selectedUsers[i]._id == element._id){
                            return
                        }
                    }
                    if(userLoggedIn._id == element._id){
                        return
                    }
                    var html = createFoundUser(element, index)
                    $('.resultsContainer').append(html)
                    $(html).html('')
                    $(`.${index}`).click(()=>{
                        userSelected(element)
                    })
                    index++
                });
                
            })
        }
    }, 1000)
})

function createFoundUser(user, index){
    return `
        <div class='header userItem ${index}' style="border: 1px solid #D3D3D3; margin: 0; padding: 10px">
            <div class='userImageContainer'> 
                <img src='${user.profilePic}'>
            </div>
            <div style="display:flex; flex-direction:column">
                <p class='displayName'>${user.displayName}</p>
            </div>
        </div>
    `
}
$(document).on('click', '.addChatButton', (event)=>{
    console.log(event.target)
})

function userSelected(user){
    selectedUsers.push(user)
    updateSelectedUsersHtml()
    $("#userSearchTextbox").val("").focus();
    $(".resultsContainer").html("");
    $("#createChatButton").prop("disabled", false);
    
}

function updateSelectedUsersHtml() {
    var elements = [];

    selectedUsers.forEach(user => {
        var name = user.displayName
        var userElement = $(`<span class='selectedUser'>${name}</span>`)
        elements.push(userElement);
    })

    $(".selectedUser").remove();
    $("#selectedUsers").prepend(elements);
}

$('#createChatButton').on('click', (event) =>{
    var data = JSON.stringify(selectedUsers);

    $.post("/api/chats", { users: data }, chat => {

        if(!chat || !chat._id) return alert("Invalid response from server.");

        window.location.href = `/messenger/${chat._id}`;
    })
})
