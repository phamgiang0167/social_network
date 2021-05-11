
$(document).ready(()=>{
    loadPosts()
})
function loadPosts(){
    $.get('/api/post', {postedBy: profile}, results =>{
        
        renderPosts(results, $('.profilePostsContainer'))
    })
}
var cropper
$('#userPhoto').change(function(){
    $('#imageProfileButton').removeAttr('disabled')
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

$('#imageProfileButton').click(()=>{
    var canvas = cropper.getCroppedCanvas()
    if(canvas == null){
        alert('aaa')
        return
    }
    canvas.toBlob((blob)=>{
        var formData = new FormData()
        formData.append('cropped', blob)
        $.ajax({
            url: "/api/users/userImage",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: ()=>{
                location.reload()
                $('#imageProfileModal').modal('hide')
                swal("Profile image changed successfully")
            }
        })
        console.log(formData.get('cropped'))
    })
    
})

$('#editName').click(e=>{
    var idUser = $('#editName').attr('data-id')
    swal("Change your name:", {
        content: "input",
    })
    .then((value) => {
        if(value == ""){
            swal('Your name has not changed yet')
        }else{
            var data = {
                newName: value
            }
            $.ajax({
                url: "/api/users/" + idUser,
                type: "PUT",
                data: data,
                success: ()=>{
                    swal('Renamed successfully')
                    $('#profileName').html(value)
                }
            })
        }
        
    });
})
$('#editClass').click(e=>{
    var idUser = $('#editClass').attr('data-id')
    swal("Change your class:", {
        content: "input",
    })
    .then((value) => {
        if(value == ""){
            swal('Your class has not changed yet')
        }else{
            var data = {
                newClass: value
            }
            $.ajax({
                url: "/api/users/" + idUser,
                type: "PUT",
                data: data,
                success: ()=>{
                    swal('Reclass successfully')
                    $('#profileClass').html(value)
                }
            })
        }
        
    });
})

$('#editFaculty').click(e=>{
    var idUser = $('#editClass').attr('data-id')
    swal("Change your class:", {
        content: "input",
    })
    .then((value) => {
        if(value == ""){
            swal('Your class has not changed yet')
        }else{
            var data = {
                newFaculty: value
            }
            $.ajax({
                url: "/api/users/" + idUser,
                type: "PUT",
                data: data,
                success: ()=>{
                    swal('ReFaculty successfully')
                    $('#profileFalcuty').html(value)
                }
            })
        }
        
    });
})