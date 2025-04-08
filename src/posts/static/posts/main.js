console.log('Hello from main.js')

const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

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

let visible = 3;

const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}/`,
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
                                    <a href="#" class="btn btn-primary">Like</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                })
            }, 100)
            console.log(response.size)
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

getData()