console.log('Hello from main.js')

const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const alertBox = document.getElementById('alert-box')

$.ajaxSetup({
    headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
    }
});

$.ajax({
    type: 'GET',
    url: '/hello-world/',
    success: function(response) {
        console.log('success', response.text)
    },
    error: function(error) {
        console.error('error', error)
    }
})

const likeUnlikePosts = ()=> {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        // console.log('CSRF Token:', document.querySelector('[name=csrfmiddlewaretoken]').value);
        $.ajax({
            type: 'POST',
            url: "/like-unlike/",
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            data: {
                'pk': clickedId
            },
            success: function(response) {
                const button = document.getElementById(`like-unlike-${clickedId}`);
                button.textContent = response.liked ? `Unlike (${response.count})` : `Like (${response.count})`;
            },
            error: function(error) {
                console.error(error)
            }
        })
    }))
}

let visible = 3;

const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}/`,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        success: function(response) {
            console.log(response)
            const data = response.data
            setTimeout(() => {
                spinnerBox.classList.add('not-visible');
                console.log(data)
                data.forEach(el => {
                    postsBox.innerHTML += `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">${el.title}</h5>
                            <p class="card-text">${el.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-2">
                                    <a href="#" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-2">
                                <form class="like-unlike-forms" data-form-id="${el.id}">
                                    <button type="submit" class="btn btn-primary" id="like-unlike-${el.id}">${el.liked ? `Unlike (${el.count})` : `Like (${el.count})`}</button>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                })
                likeUnlikePosts()
            }, 100)
            // console.log(response.size)
            if (response.size === 0) {
                endBox.textContent = 'No posts available'
            }
            else if (response.size <= visible) {
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'End of posts'
            }
        },
        error: function(error) {
            console.error(error)
        }
    })
}

loadBtn.addEventListener('click', () => {
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})

postForm.addEventListener('submit', e => {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        data: {
            'title': title.value,
            'body': body.value
        },
        success: function(response) {
            console.log('Post submitted successfully', response);
            postsBox.insertAdjacentHTML('afterbegin', `
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="#" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-2">
                            <form class="like-unlike-forms" data-form-id="${response.id}">
                                <button type="submit" class="btn btn-primary" id="like-unlike-${response.id}">${response.liked ? `Unlike (${response.count})` : `Like (0)`}</button>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            `)
            likeUnlikePosts()
            $('#addPostModal').modal('hide')
            handleAlerts('success', 'Post created successfully')
        },
        error: function(error) {
            console.error('Error submitting post', error);
            handleAlerts('danger', 'Error submitting post')
        }
    });
});

getData()