

$(document).ready(()=>{
    if(userLoggedIn.role == 'admin'){
        $.get('/api/office', results=>{
            results.forEach(element => {
                var table = document.getElementById("accountTable")
                var row = table.insertRow(1)
                var cell1 = row.insertCell(0)
                var cell2 = row.insertCell(1)
                var cell3 = row.insertCell(2)
                var cell4 = row.insertCell(3)
                cell1.innerHTML = element.displayName
                cell2.innerHTML = element.username
                cell3.innerHTML = `<a href="#" class="chooseAcces" data-toggle="modal" data-target="#chooseAccessModal" data-id=${element._id}>choose</a>`
                cell4.innerHTML = `<span><i class="fas fa-user-slash"></i>&nbsp&nbsp</span><span><i class="fas fa-user-edit"></i></span>`
            });
        })
    }else{
        $.get('/api/notification/office/' + userLoggedIn._id, results=>{
            results.forEach(element =>{
                var table = document.getElementById("notificationTable")
                var row = table.insertRow(1)
                var cell1 = row.insertCell(0)
                var cell2 = row.insertCell(1)
                var cell3 = row.insertCell(2)
                var cell4 = row.insertCell(3)
                cell1.innerHTML = `<a href="#">${element.title}</a>`
                cell2.innerHTML = element.category
                cell3.innerHTML = element.createdAt
                cell4.innerHTML = `<span><i class="fas fa-user-slash"></i>&nbsp&nbsp</span><span><i class="fas fa-user-edit"></i></span>`
            })
           
        })
    }
})


$('#createAccountButton').click(()=>{
    var username = $('#username').val()
    var password = $('#password').val()
    var name = $('#name').val()
    data = {
        username: username,
        password: password,
        name: name
    }
    $('#username').val('')
    $('#password').val('')
    $('#name').val('')
    $('#createAccountModal').modal('hide')
    $.ajax({
        url: `/register`,
        type: `POST`,
        data : data,

        success: (newUser) =>{
            var table = document.getElementById("accountTable")
            var row = table.insertRow(1)
            var cell1 = row.insertCell(0)
            var cell2 = row.insertCell(1)
            var cell3 = row.insertCell(2)
            var cell4 = row.insertCell(3)
            cell1.innerHTML = newUser.displayName
            cell2.innerHTML = newUser.username
            cell3.innerHTML = `<a href="#" data-toggle="modal" data-target="#chooseAccessModal" data-id=${newUser._id}>choose</a>`
            cell4.innerHTML = `<span><i class="fas fa-user-slash"></i></span>&nbsp&nbsp<span><i class="fas fa-user-edit"></i></span>`
        }
    })
})


$("#chooseAccessModal").on("show.bs.modal", async (event) => {
    var button = event.relatedTarget
    $('#chooseAccessButton').data('id', button.getAttribute('data-id'))
    
    var data = await {
        id: button.getAttribute('data-id'),
    }
    console.log(data.id)
    $.ajax({
        url: '/api/office/access',
        type: "GET",
        data: data,
        success: (access)=>{
            var list = $('.form-check-input')
            for(var i = 0; i < list.length; i++){
                if(access.includes(list[i].getAttribute('value'))){
                    list[i].checked = true
                }else{
                    list[i].checked = false
                }

            }
            
        }
    })
})

$('#chooseAccessButton').click(()=>{

    var modal = document.getElementById('chooseAccessModal')
    var option = modal.getElementsByTagName('input')
    var listChecked = []
    for(var i = 0; i < option.length; i++){
        if(option[i].checked == true){
            listChecked.push(option[i].parentElement.innerText)
        }
    }
    // console.log($('#chooseAccessButton').data('id'))
    var data = {
        id: $('#chooseAccessButton').data('id'),
        list: listChecked.toString()
    }
    $.ajax({
        url: '/api/office',
        type: 'PUT',
        data: data,
        success: ()=>{
            $("#chooseAccessModal").modal('hide')
        }
    })
    
})

$("#createNotificationModal").on("show.bs.modal", async (event) => {
    var listAccess = userLoggedIn.access
    var modal = event.target 
    var select = document.getElementById('access')
    listAccess.forEach(e =>{
        $(select).append(`<option value="${e}">${e}</option>`)
    })
})

$('#createNotificationButton').on('click', e=>{
    var listAccess = userLoggedIn.access
    var modal = event.target
    var select = document.getElementById('access')
    var data = {
        title: $('#titleNotification').val(),
        content: $('#contentNotification').val(),
        category: $('#access option:selected').text(),
        postedBy: userLoggedIn._id
    }
    $.ajax({
        url: '/api/notification/',
        type: "POST",
        data: data,
        success: ()=>{
            $("#createNotificationModal").modal('hide')
        }
    })
})