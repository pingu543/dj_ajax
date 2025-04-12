console.log('static profiles main js')

const avatarBox = document.getElementById('avatar-box')
const profileForm = document.getElementById('profile-form')
const alertBox = document.getElementById('alert-box')

const bioInput = document.getElementById('id_bio')
const avatarInput = document.getElementById('id_avatar')

const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
// add csrf token to all ajax requests
$.ajaxSetup({
    headers: {
        'X-CSRFToken': csrfToken
    }
});

profileForm.addEventListener('submit', e => {
    e.preventDefault()

    const formData=new FormData()
    formData.append('bio', bioInput.value)
    formData.append('avatar', avatarInput.files[0])

    $.ajax({
        type: 'POST',
        url: '',
        enctype: 'multipart/form-data',
        data: formData,
        success: function(response) {
            console.log('success', response)
            avatarBox.innerHTML = `
                <img src="${response.avatar}" alt=${response.user} class="rounded" height="200px" width="200px">
            `
            bioInput.value = response.bio
            handleAlerts('success', 'Profile updated successfully.')
        },
        error: function(error) {
            console.error('error', error)
        },
        processData: false,
        contentType: false,
        cache: false,
    })
})