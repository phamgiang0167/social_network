


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
                cell4.innerHTML = `<span class='editUserManage' data-toggle="modal" data-target="#editAccountModal"  data-id=${element._id}><i class="fas fa-user-edit"></i>&nbsp&nbsp</span > <span class='deleteUserManage'><i data-id=${element._id} class="fas fa-user-slash"></i></span>`
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
                cell1.innerHTML = `<a href="/notification/${element._id}">${element.title}</a>`
                cell2.innerHTML = element.category
                cell3.innerHTML = element.createdAt
                cell4.innerHTML = `<span class='deleteNoti'><i class="fas fa-trash-alt" data-id=${element._id}></i>&nbsp&nbsp</span><span data-toggle="modal" data-target="#editNotificationModal" class='editNoti' data-id=${element._id}><i class="fas fa-edit"></i></span>`
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
            location.reload()
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
        category: $('.access option:selected').text(),
        postedBy: userLoggedIn._id
    }
    $.ajax({
        url: '/api/notification/',
        type: "POST",
        data: data,
        success: (noti)=>{
            console.log(noti)
            
            $("#createNotificationModal").modal('hide')
            emitNotification(noti)
            location.reload()
        }
    })
})

$(document).on('click', '.deleteUserManage', (event)=>{
    var button = event.target
    var id = $(button).data('id')
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this user",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) { 
            swal("Poof! This user has been deleted!", {
                icon: "success",
            });
            $.ajax({
            url: `/api/office/${id}`,
            type: 'DELETE',
            success: ()=>{
                location.reload()
            }
        })
        } else {
          swal("Nothing happened");
        }
      });
   
})

$("#editAccountModal").on("show.bs.modal", async (event) => {
    var button = event.relatedTarget
    var id = $(button).data('id')
    $('#editAccountButton').data('id', id)
})
$("#editNotificationModal").on("show.bs.modal", async (event) => {
    var listAccess = userLoggedIn.access
    var modal = event.target 
    var select = document.getElementById('accessEditNoti')
    listAccess.forEach(e =>{
        $(select).append(`<option value="${e}">${e}</option>`)
    })
    var button = event.relatedTarget
    var id = $(button).data('id')
    $('#editNotificationButton').data('id', id)
})
$("#editAccountButton").on("click", async (event) => {
    var button = event.target
    var id = $(button).data('id')
    console.log($('#editName').val())
    var data = {
        name: $('#editName').val(),
        username: $('#editUsername').val(),
        password: $('#editPassword').val(),
    }
    if(data.name == "" ||
    data.username == "" ||
    data.password == ""){
        swal('you missed some field')
    }else{
        $.ajax({
        url: `/api/office/${id}`,
        type: 'PUT',
        data: data,
        success: ()=>{
            location.reload()
        }
    })
    }
    
})

$(document).on('click', '.deleteNoti', (event)=>{
    var button = event.target
    var id = $(button).data('id')
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this notification",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) { 
            swal("Poof! This user has been deleted!", {
                icon: "success",
            });
            $.ajax({
            url: `/api/notification/${id}`,
            type: 'DELETE',
            success: ()=>{
                location.reload()
            }
        })
        } else {
          swal("Nothing happened");
        }
      });
   
})

$("#editNotificationButton").on("click", async (event) => {
    var button = event.target
    console.log(button)
    var id = $(button).data('id')
    var data = {
        title: $('#editTitleNotification').val(),
        content: $('#editContentNotification').val(),
        category: $('#accessEditNoti option:selected').text(),
    }
    if(data.title == "" ||
    data.content == "" ||
    data.category == ""){
        swal('you missed some field')
    }else{
        $.ajax({
        url: `/api/notification/${id}`,
        type: 'PUT',
        data: data,
        success: ()=>{
            location.reload()
        }
    })
    }
    
})