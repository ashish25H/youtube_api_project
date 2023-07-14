const alertPlaceholder = document.querySelector('.show-alert');
const API_KEY = `AIzaSyD16YbHRdrvgBkdyuWkPbqez5KLDVYZQoI`;
export const START_STRING = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20`;
export const END_STRING = `&type=video&key=${API_KEY}`;

let nextPage = '';


export function appendAlert(message, type) {
    const div = `<div>
    <div class="alert alert-${type} alert-dismissible" role="alert">
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        </div> `;

    alertPlaceholder.innerHTML = div;
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

    let url = nextPage ? `${START_STRING}&pageToken=${nextPage}${END_STRING}` : `${START_STRING}${END_STRING}`;

    $.get(url, function (data) {
        nextPage = data.nextPageToken;
        let card = '';
        for (let item of data.items) {
            card += cardHtml(item.snippet.thumbnails?.high.url, item.id.videoId, item.snippet.title);
        }
        $('#loading-msg').hide();
        $('#cards').append(card);
    }).fail(function (err) {
        console.log(`some error occurred`);
        console.log(err);
    });
}

$('#submit-btn').click(function () {
    if ($('#input-text').val()) {
        window.location.href = 'secondPage.html';
        localStorage.setItem('query', $('#input-text').val());
        $('#input-text').val('');
    } else {
        appendAlert('Please Enter a String', 'danger');
    }
});

export function scrollPage(loadItems){
    window.addEventListener('scroll', function () {
        const scrollable = this.document.documentElement.scrollHeight - this.window.innerHeight;
        const scrolled = this.window.scrollY;
    
        if (Math.floor(scrollable) === Math.floor(scrolled)) {
            loadItems();
        }
    
    });
};
scrollPage(loadItems);

$('#cards').on('click', '.card-data', function () {
    $('.modal-img').attr('src', $(this).data('src'));
    $('.video-link').attr('href', `https://youtu.be/${$(this).data('video')}`);
});

loadItems();
























