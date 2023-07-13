const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const API_KEY = `AIzaSyBHUKm2KTSU4psulz-gU7Ji7M3bb6klt30`;

let nextPage = '';

export function appendAlert(message, type) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}

export function cardHtml(thumbnail, videoId, title) {
    return `<div class="card g-col-4" style="width: 18rem;">
    <img src="${thumbnail}" class="card-img-top" alt="thumbnail">
    <div class="card-body" >
        <h5 class="card-title card-data" data-bs-toggle="modal" data-bs-target="#exampleModal" data-src=${thumbnail} data-video=${videoId}>
        ${title}</h5>          
    </div>
  </div>`
}

function loadItems() {
    $('#loading-msg').show();

    let url = nextPage ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&pageToken=${nextPage}&type=video&key=${API_KEY}`
        : `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&key=${API_KEY}`;

    $.get(url, function (data) {
        nextPage = data.nextPageToken;
        let card = '';
        for (let item of data.items) {
            card += cardHtml(item.snippet.thumbnails?.high.url, item.id.videoId, item.snippet.title);
        }
        $('#loading-msg').hide();
        $('#cards').append(card);
    }).fail(function (err) {
        console.log(`some error occured`);
        console.log(err);
    });
}

$('form').submit(function (event) {
    event.preventDefault();
});

$('#submit-btn').click(function () {
    if ($('#input-text').val()) {
        window.location.href = 'secondPage.html';
        localStorage.setItem('query', $('#input-text').val());
        $('#input-text').val('');
    } else {
        appendAlert('Please Enter a String', 'danger');
    }
});

window.addEventListener('scroll', function () {
    const scrollable = this.document.documentElement.scrollHeight - this.window.innerHeight;
    const scrolled = this.window.scrollY;

    if (Math.floor(scrollable) === Math.floor(scrolled)) {
        loadItems();
    }

});

$('#cards').on('click', '.card-data', function () {
    $('.modal-img').attr('src', $(this).data('src'));
    $('.video-link').attr('href', `https://youtu.be/${$(this).data('video')}`);
});

loadItems();
























