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
                    console.log(selectedUsers.includes(element))
                    if(userLoggedIn._id == element._id || selectedUsers.includes(element)){
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
        <div class='header ${index}' style="border: 1px solid #D3D3D3; margin: 0; padding: 10px">
            <div class='userImageContainer'> 
                <img src='${user.profilePic}'>
            </div>
            <div style="display:flex; flex-direction:column">
                <p class='displayName'>${user.displayName}</p>
                <a class="chat" href= "/message/${user._id}">
                    <i class="fas fa-envelope"></i>    
                </a>
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

