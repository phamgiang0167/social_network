var timer
$("#searchBox").keydown((event) => {
    clearTimeout(timer);
    var textbox = $(event.target);
    var value = textbox.val();

    timer = setTimeout(() => {
        value = textbox.val().trim();

        if(value == "") {
            $(".resultsContainer").html("");
        }
        else {
            $.get("/api/users", { keyword: value }, (results) => {
                $('.resultsContainer').html('')
                results.forEach(element => {
                    $('.resultsContainer').append(`
                    <div class='header' style="border: 1px solid #D3D3D3; margin: 0; padding: 10px">
                        <div class='userImageContainer'> 
                            <img src='${element.profilePic}'>
                        </div>
                        <div style="display:flex; flex-direction:column">
                            <a href='/profile/${element.username}' class='displayName'>${element.displayName}</a>
                        </div>
                    </div>
                    `)
                });
                
            })
        }
    }, 1000)
    console.log(value)
})
